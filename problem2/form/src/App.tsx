import React, { useState } from 'react'
import InputComponent from './components/InputComponent'
import { swapIcon } from './assets/assets'
import type { Token } from './types'

const emptyToken = {
  currency: "",
  date: "",
  price: 0
}

const App = () => {
  const [listToken, setListCoin] = useState<Token[]>([])
  const [leftToken, setLeftToken] = useState<Token>(emptyToken)
  const [rightToken, setRightToken] = useState<Token>(emptyToken)
  const [leftValue, setLeftValue] = useState("")
  const [rightValue, setRightValue] = useState("")

  const getData = async () => {
    const imageUrl = `${import.meta.env.VITE_COIN_URL}`;
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        return;
      }
      const data = await response.json()
      setListCoin(data)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return;
    }
  }

  React.useEffect(() => {
    getData()
  }, [])

  const onClickSwap = () => {
    const currentLeftToken = { ...leftToken } as Token
    const currentRightToken = { ...rightToken } as Token
    setLeftToken(currentRightToken)
    setRightToken(currentLeftToken)
    const newRightValue = Number(Number(leftValue) * (currentRightToken.price / currentLeftToken.price)).toFixed(6)
    setRightValue(newRightValue.toString())
  }

  const onClickConvert = () => {
    const newRightValue = Number(Number(leftValue) * (leftToken.price / rightToken.price)).toFixed(6)
    setRightValue(newRightValue.toString())
  }

  const onChangeLeftToken = (value: string) => {
    const currentToken = listToken.find((token) => token.currency === value)
    if (currentToken) setLeftToken(currentToken)
  }

  const onChangeRightToken = (value: string) => {
    const currentToken = listToken.find((token) => token.currency === value)
    if (currentToken) setRightToken(currentToken)
  }

  const onChangeLeftValue = (value: string) => {
    setLeftValue(value)
  }

  const onChangeRightValue = (value: string) => {
    setRightValue(value)
  }

  return (
    <div style={styles.container}>
      <div>
        <h2 style={styles.header}>Swap Form</h2>
        <form className='main' data-testid="form">
          <InputComponent
            testId='leftInput'
            title='Amount to send'
            options={listToken}
            customStyles={styles.input}
            onChangeOptionValue={onChangeLeftToken}
            currentOptionValue={{
              value: leftToken.price,
              label: leftToken.currency,
            }}
            currentNumberValue={leftValue}
            onChangeNumberValue={onChangeLeftValue}
          />
          <div style={styles.viewButton}>
            <img data-testid="switchIcon" src={swapIcon} style={styles.icon} onClick={onClickSwap} />
            <button data-testid="convertIcon" type="button" onClick={onClickConvert}>
              Convert
            </button>
          </div>
          <InputComponent
            testId='rightInput'
            title='Amount to receive'
            options={listToken}
            customStyles={styles.input}
            onChangeOptionValue={onChangeRightToken}
            currentOptionValue={{
              value: rightToken?.price ?? 0,
              label: rightToken?.currency ?? "",
            }}
            isDisabled
            currentNumberValue={rightValue}
            onChangeNumberValue={onChangeRightValue}
          />
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: {
    width: "100%",
    height: "100vh",
    alignItems: 'center',
    display: 'flex',
    justifyContent: "center"
  } as React.CSSProperties,
  header: {
    textAlign: 'center',
    margin: 0,
    marginBottom: 20
  } as React.CSSProperties,
  input: {
    width: "300px",
  },
  icon: {
    width: "20px",
    height: "20px",
    cursor: "pointer"
  } as React.CSSProperties,
  viewButton: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px"
  } as React.CSSProperties
}

export default App
