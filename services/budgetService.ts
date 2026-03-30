import { firestore } from "@/config/firebase";
import { BudgetType, ExpenseLimitPeriod, ResponseType } from "@/types";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

const validTypes: ExpenseLimitPeriod[] = ["day", "week", "month"];

export const getBudgetByWalletId = async (
  walletId: string,
): Promise<ResponseType> => {
  try {
    const budgetQuery = query(
      collection(firestore, "budget"),
      where("walletId", "==", walletId),
    );

    const snapshot = await getDocs(budgetQuery);
    const byType: Partial<Record<ExpenseLimitPeriod, BudgetType>> = {};

    snapshot.docs.forEach((item) => {
      const budget = { id: item.id, ...item.data() } as BudgetType;
      if (!budget?.type || !validTypes.includes(budget.type)) return;

      const amount = Number(budget.amount);
      if (!amount || amount <= 0) return;

      // Keep one budget per type; latest iteration overrides older duplicates.
      byType[budget.type] = {
        id: budget.id,
        walletId: budget.walletId,
        type: budget.type,
        amount,
      };
    });

    const budgets = (Object.keys(byType) as ExpenseLimitPeriod[]).map((type) => {
      return byType[type] as BudgetType;
    });

    return { success: true, data: budgets };
  } catch (err: any) {
    console.log("error fetching budget by wallet: ", err);
    return { success: false, msg: err.message };
  }
};

export const createOrUpdateBudget = async (
  payload: Pick<BudgetType, "walletId" | "type" | "amount">,
): Promise<ResponseType> => {
  try {
    const { walletId, type, amount } = payload;

    if (!walletId || !validTypes.includes(type) || !amount || amount <= 0) {
      return { success: false, msg: "Invalid budget data" };
    }

    const existingQuery = query(
      collection(firestore, "budget"),
      where("walletId", "==", walletId),
      where("type", "==", type),
    );
    const existingSnapshot = await getDocs(existingQuery);

    const budgetRef = !existingSnapshot.empty
      ? doc(firestore, "budget", existingSnapshot.docs[0].id)
      : doc(collection(firestore, "budget"));

    await setDoc(
      budgetRef,
      {
        walletId,
        type,
        amount,
      },
      { merge: true },
    );

    return {
      success: true,
      data: {
        id: budgetRef.id,
        walletId,
        type,
        amount,
      },
    };
  } catch (err: any) {
    console.log("error creating or updating budget: ", err);
    return { success: false, msg: err.message };
  }
};

export const deleteBudget = async (id: string): Promise<ResponseType> => {
  try {
    await deleteDoc(doc(firestore, "budget", id));
    return { success: true, msg: "Budget deleted" };
  } catch (err: any) {
    console.log("error deleting budget: ", err);
    return { success: false, msg: err.message };
  }
};
