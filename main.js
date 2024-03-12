// [x] transaction system
// [x] transfer funds between accounts
// [x] display reports

//custom feature:
// [x] create groups
// [x] Bundle group payment

//act as database
const contacts = [];
const deposits = [];
const withdrawals = [];
const transfers = [];

//helper functions
function getTotalAmount(accumulator, element) {
  return accumulator + element.amount;
}

function getTotalAmountWithTransactionCost(accumulator, element) {
  return accumulator + element.amount + element.transactionCost;
}

function getNameByPhoneNumber(phone) {
  const c = contacts.find((e) => e.phoneNumber === phone);
  return c.firstName + " " + c.lastName;
}

function getTransactionCostForAmount(amount) {
  if (amount <= 1000) return 10;
  else if (amount <= 10000) return 15;
  else if (amount <= 100000) return 20;
}
//Classes : contact,transfer,group

class Contact {
  phoneNumber;
  firstName;
  lastName;

  constructor(phone, fname, lname) {
    this.phoneNumber = phone;
    this.firstName = fname;
    this.lastName = lname;

    contacts.push(this); //check on this
    // console.log(contacts,this)//every instance of contact is pushed into the array
  }

  //get functions
  get deposits() {
    return deposits.filter((e) => e.phoneNumber === this.phoneNumber);
  }
  get totalDeposited() {
    return this.deposits.reduce(getTotalAmount, 0);
  }
  get withdrawals() {
    return withdrawals.filter((e) => e.phoneNumber === this.phoneNumber);
  }
  get totalWithdrawn() {
    return this.withdrawals.reduce(getTotalAmount, 0);
  }
  get totalWithdrawnWithTransactionCosts() {
    return this.withdrawals.reduce(getTotalAmountWithTransactionCost, 0);
  }
  // receiving === crediting my acc
  get creditTransactions() {
    return transfers.filter((e) => e.receiver === this.phoneNumber);
  }
  get totalReceived() {
    return this.creditTransactions.reduce(getTotalAmount, 0);
  }
  get debitTransactions() {
    return transfers.filter((e) => e.sender === this.phoneNumber);
  }
  get totalSent() {
    return this.debitTransactions.reduce(getTotalAmount, 0);
  }
  get totalSentWithTransactionCosts() {
    return this.debitTransactions.reduce(getTotalAmountWithTransactionCost, 0);
  }

  get balance() {
    const Balance = this.totalDeposited + this.totalReceived - (this.totalWithdrawnWithTransactionCosts + this.totalSentWithTransactionCosts);
    return Balance;
  }

  // print report
  printStatement() {
    console.log(` ${this.firstName} ${this.lastName}
---- Statement: --------------------------------------------------------
	Total Deposits		: ${this.deposits.length}
	Amount Deposited	: KSH ${this.totalDeposited}
	Total Withdrawals	: ${this.withdrawals.length}	
	Amount Withdrawn	: KSH ${this.totalWithdrawn}
  
	----------------------------------------------------------------
	Total Amount Sent	:  KSH ${this.totalSent} in ${this.debitTransactions.length} transactions
	Total Amount Received 	:  KSH ${this.totalReceived} in ${this.creditTransactions.length} transactions
	----------------------------------------------------------------
	Balance				: KSH ${this.balance}
------------------------------------------------------------------------
`);
  }

  printTransactionHistory() {
    console.log("---- History: ----------------------------------------------------------");
    console.log(`${this.firstName} sent a total of KSH ${this.totalSent}`);
    const debitHistory = this.debitTransactions.map((e) => {
      return {
        "Sent to": getNameByPhoneNumber(e.receiver),
        "Amount (KSH)": e.amount,
        "Transaction cost (KSH)": e.transactionCost,
      };
    });
    console.table(debitHistory);
    console.log(`and received a total of KES ${this.totalReceived}`);
    const creditHistory = this.creditTransactions.map((e) => {
      return {
        "Received from ": getNameByPhoneNumber(e.sender),
        "Amount (KSH)": e.amount,
      };
    });
    console.table(creditHistory);
    console.log("------------------------------------------------------------------------");
  }
}

class Transfer {
  sender;
  receiver;
  amount;
  transactionCost;

  constructor(sender, receiver, amount) {
    this.sender = sender;
    this.receiver = receiver;
    this.amount = amount;
    this.transactionCost = getTransactionCostForAmount(amount);

    const senderName = getNameByPhoneNumber(sender);
    const receiverName = getNameByPhoneNumber(receiver);

    console.log(`${senderName} has sent KSH ${amount} to ${receiverName} Transaction Cost : KSH ${this.transactionCost}`);

    transfers.push(this);
  }
}

class Deposit {
  phoneNumber;
  amount;
  constructor(phone, amount) {
    this.phoneNumber = phone;
    this.amount = amount;
    this.save();
  }
  save() {
    deposits.push(this);
  }
}

class Withdrawal extends Deposit {
  get transactionCost() {
    return getTransactionCostForAmount(this.amount);
  }
  save() {
    withdrawals.push(this);
  }
}

class Group {
  name;
  members = []; // array of phone numbers

  constructor(str) {
    this.name = str;
  }

  //adding group members
  addMembers(...arr) {
    this.members.push(...arr);
  }

  //remove members
  removeMembers(...arr) {
    // get all phone numbers, where e (phone number) is not included in the array we pass
    this.members = this.members.filter((e) => !arr.includes(e));
    arr.forEach((phone) => {
      const memberName = getNameByPhoneNumber(phone);
      console.log(`Removed ${memberName} from Group : ${this.name}`);
    });
  }

  //make group payments
  makeBulkPayments(sender, amount) {
    for (let i = 0; i < this.members.length; i++) {
      const receiver = this.members[i];
      if (sender !== receiver) new Transfer(sender, receiver, amount); // to make sure the sender doesnt self send
    }
  }
}

//Adding Contacts
const Andrew = new Contact("987", "Andrew", "James");
const Mav = new Contact("874", "Mav", "Tall");
const Sakina = new Contact("964", "Sakina", "Brenda");
const Alex = new Contact("222", "Alex", "Jeremy");
const Aby = new Contact("264", "ABy", "Doll");
const Dru = new Contact("999", "Dru", "Cilla");
const Amy = new Contact("189", "Amy", "Lean");
const Jamie = new Contact("306", "Jamie", "Johnte");
const Malaika = new Contact("841", "Malaika", "Rich");
const Cormac = new Contact("708", "Comarc", "Mark");
const Naske = new Contact("387", "Naske", "Sims");
const Belinda = new Contact("721", "Belinda", "Anne");
const Anne = new Contact("700", "Anne", "Lili");
const Mike = new Contact("123", "Mike", "Simso");
const Trevis = new Contact("321", "Trevis", "Law");
const Viola = new Contact("509", "Viola", "Konji");

//Initialize 50k in Andrew's Mpesa
new Deposit(Andrew.phoneNumber, 50000);

new Transfer(Andrew.phoneNumber, Jamie.phoneNumber, 6000);
new Transfer(Andrew.phoneNumber, Sakina.phoneNumber, 12000);
new Transfer(Andrew.phoneNumber, Jamie.phoneNumber, 1000);
new Transfer(Andrew.phoneNumber, Jamie.phoneNumber, 4000);

// ---- Groups ---------------------------------------------------------------------------

//Sacco Group
const Sacco = new Group("Sacco");
Sacco.addMembers(
  Andrew.phoneNumber,
  Jamie.phoneNumber,
  Mav.phoneNumber,
  Sakina.phoneNumber,
  Alex.phoneNumber,
  Amy.phoneNumber,
  Aby.phoneNumber,
  Dru.phoneNumber,
  Malaika.phoneNumber,
  Anne.phoneNumber
);

//Chama Group
const Chama = new Group("Chama");
Chama.addMembers(Andrew.phoneNumber, Jamie.phoneNumber, Mav.phoneNumber, Viola.phoneNumber, Mike.phoneNumber, Trevis.phoneNumber);

//console.log(Chama)

//Removing 6 Members from Sacco
Sacco.removeMembers(Mav.phoneNumber, Jamie.phoneNumber, Amy.phoneNumber, Dru.phoneNumber, Alex.phoneNumber, Malaika.phoneNumber);

//Making Group Payments
Sacco.makeBulkPayments(Andrew.phoneNumber, 100);
Chama.makeBulkPayments(Andrew.phoneNumber, 500); //Evening
Chama.makeBulkPayments(Andrew.phoneNumber, 500); //Morning

//Withdrawals
new Withdrawal(Andrew.phoneNumber, 500);
new Withdrawal(Andrew.phoneNumber, 1000);

// ---- Statement/Report -----------------------------------------------------------------
console.log(Andrew.balance);

Andrew.printStatement();
Andrew.printTransactionHistory();
