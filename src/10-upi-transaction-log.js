/**
 * 💸 UPI Transaction Log Analyzer
 *
 * Aaj kal sab UPI pe chalta hai! Tujhe ek month ke transactions ka log
 * milega, aur tujhe pura analysis karna hai - kitna aaya, kitna gaya,
 * kiski saath zyada transactions hue, etc.
 *
 * Rules:
 *   - transactions is array of objects:
 *     [{ id: "TXN001", type: "credit"/"debit", amount: 500,
 *        to: "Rahul", category: "food", date: "2025-01-15" }, ...]
 *   - Skip transactions where amount is not a positive number
 *   - Skip transactions where type is not "credit" or "debit"
 *   - Calculate (on valid transactions only):
 *     - totalCredit: sum of all "credit" type amounts
 *     - totalDebit: sum of all "debit" type amounts
 *     - netBalance: totalCredit - totalDebit
 *     - transactionCount: total number of valid transactions
 *     - avgTransaction: Math.round(sum of all valid amounts / transactionCount)
 *     - highestTransaction: the full transaction object with highest amount
 *     - categoryBreakdown: object with category as key and total amount as value
 *       e.g., { food: 1500, travel: 800 } (include both credit and debit)
 *     - frequentContact: the "to" field value that appears most often
 *       (if tie, return whichever appears first)
 *     - allAbove100: boolean, true if every valid transaction amount > 100 (use every)
 *     - hasLargeTransaction: boolean, true if some valid amount >= 5000 (use some)
 *   - Hint: Use filter(), reduce(), sort(), find(), every(), some(),
 *     Object.entries(), Math.round(), typeof
 *
 * Validation:
 *   - Agar transactions array nahi hai ya empty hai, return null
 *   - Agar after filtering invalid transactions, koi valid nahi bacha, return null
 *
 * @param {Array<{ id: string, type: string, amount: number, to: string, category: string, date: string }>} transactions
 * @returns {{ totalCredit: number, totalDebit: number, netBalance: number, transactionCount: number, avgTransaction: number, highestTransaction: object, categoryBreakdown: object, frequentContact: string, allAbove100: boolean, hasLargeTransaction: boolean } | null}
 *
 * @example
 *   analyzeUPITransactions([
 *     { id: "T1", type: "credit", amount: 5000, to: "Salary", category: "income", date: "2025-01-01" },
 *     { id: "T2", type: "debit", amount: 200, to: "Swiggy", category: "food", date: "2025-01-02" },
 *     { id: "T3", type: "debit", amount: 100, to: "Swiggy", category: "food", date: "2025-01-03" }
 *   ])
 *   // => { totalCredit: 5000, totalDebit: 300, netBalance: 4700,
 *   //      transactionCount: 3, avgTransaction: 1767,
 *   //      highestTransaction: { id: "T1", ... },
 *   //      categoryBreakdown: { income: 5000, food: 300 },
 *   //      frequentContact: "Swiggy", allAbove100: false, hasLargeTransaction: true }
 */
export function analyzeUPITransactions(transactions) {
  // Your code here

  if (!Array.isArray(transactions) || transactions.length === 0) return null;

  const filteredTransaction = transactions.filter((item) => {
    return (
      typeof item.amount === "number" &&
      item.amount > 0 &&
      (item.type === "credit" || item.type === "debit")
    );
  });

  if (filteredTransaction.length === 0) return null;

  const total = filteredTransaction.reduce(
    (prev, curr) => {
      prev[curr.type] = (prev[curr.type] || 0) + curr.amount;
      return prev;
    },
    { credit: 0, debit: 0 },
  );

  const categoryBreakdown = filteredTransaction.reduce((prev, curr) => {
    prev[curr.category] = (prev[curr.category] || 0) + curr.amount;
    return prev;
  }, {});

  const transactionCount = filteredTransaction.length;

  const totalAmount = filteredTransaction.reduce((acc, t) => acc + t.amount, 0);

  const avgTransaction = Math.round(totalAmount / transactionCount);

  const contactCount = filteredTransaction.reduce((acc, curr) => {
    acc[curr.to] = (acc[curr.to] || 0) + 1;
    return acc;
  }, {});

  let frequentContact = null;
  let maxCount = 0;

  for (let contact in contactCount) {
    if (contactCount[contact] > maxCount) {
      maxCount = contactCount[contact];
      frequentContact = contact;
    }
  }

  let highestTransaction = filteredTransaction[0];

  for (let i = 1; i < filteredTransaction.length; i++) {
    if (filteredTransaction[i].amount > highestTransaction.amount) {
      highestTransaction = filteredTransaction[i];
    }
  }

  const allAbove100 = filteredTransaction.every((item) => item.amount > 100);

  const hasLargeTransaction = filteredTransaction.some(
    (item) => item.amount >= 5000,
  );
  return {
    totalDebit: total.debit,
    totalCredit: total.credit,
    netBalance: total.credit - total.debit,
    transactionCount,
    categoryBreakdown,
    avgTransaction,
    frequentContact,
    highestTransaction,
    allAbove100,
    hasLargeTransaction,
  };
}
