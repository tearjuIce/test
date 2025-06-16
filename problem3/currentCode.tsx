interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {

}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

	const getPriority = (blockchain: any): number => {
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	}

  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
		  if (lhsPriority > -99) {
		     if (balance.amount <= 0) {
		       return true;
		     }
		  }
		  return false
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  }
    });
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}

The code has the computational inefficiencies and anti-patterns below: 
1. "formattedBalances" and "children" is unused
2. "index" should not be used as "key" for "WalletRow". We should use something more representative
like "WalletRow_${index}" or "${balance.blockchain}_${balance.currency}"
3. "WalletBalance" is missing the property "blockchain"
4. "rows" must have use "formattedBalances" instead of "sortedBalances" because in "sortedBalances",
item does not have property "formatted" like item in "formattedBalances", which will make it undefined
5. Function "getPriority" should have define the parameter "blockchain" with a type like "string",
because the case checking in switch is all string like "Osmosis", "Etherium", etc. This function should
also move out of the component "WalletPage" so that when "WalletPage" is re-render, it will not get 
re-declared. Or we can use useMemo for function "getPriority" for the same purpose
6. In "sortedBalances", "lhsPriority" is not defined which will cause runtime error while 
"balancePriority" is defined but not used. Also, in case "lhsPriority" has been defined somewhere,
the naming convention is not clear enough, make the new developer reading the
code may have a hard time to understand what it's about
7. the "sort" in "sortedBalances" should define the case return 0 in the end of it for the best 
practice
