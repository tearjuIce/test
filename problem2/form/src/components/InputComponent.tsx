import React, { memo, useState, useEffect } from 'react'
import Select, { type GroupBase, type OptionProps, type SingleValueProps, components } from 'react-select';
import type { Token } from '../types';
import ImageComponent from './ImageComponent';

type ListSelect = {
    value: number;
    label: string;
}

type InputComponentProps = {
    testId?: string
    currentOptionValue: ListSelect;
    currentNumberValue: string;
    title: string;
    options: Token[];
    customStyles?: React.CSSProperties
    onChangeOptionValue: (value: string) => void
    onChangeNumberValue?: (value: string) => void
    isDisabled?: boolean
}

const CustomSelectValue = (props: SingleValueProps<ListSelect, false, GroupBase<ListSelect>>) => {
    return (
        <components.SingleValue {...props}>
            <ImageComponent tokenSymbol={props.data.label} />
            <span>{props.data.label}</span>
        </components.SingleValue>
    )
}

const CustomOption = ({ children, ...props }: OptionProps<ListSelect, false, GroupBase<ListSelect>>) => {
  return (
    <components.Option {...props}>
      <ImageComponent tokenSymbol={props.data.label} />
      {children}
    </components.Option>
  );
};

const InputComponent = memo(({
    testId,
    currentOptionValue,
    currentNumberValue,
    title,
    options,
    customStyles,
    onChangeOptionValue,
    onChangeNumberValue,
    isDisabled
}: InputComponentProps) => {
    const [selectedOption, setSelectedOption] = useState<ListSelect | null>(null);
    const [listOptions, setListOption] = useState<ListSelect[]>([]);
    const [value, setValue] = useState("")

    useEffect(() => {
        const arrayValue = options.map((option) => ({
            value: option.price,
            label: option.currency,
        }))
        setListOption(arrayValue)
    }, [options])

    useEffect(() => {
        if (currentOptionValue.label === "") setSelectedOption(null)
        else setSelectedOption(currentOptionValue)
    }, [currentOptionValue])

    useEffect(() => {
        setValue(currentNumberValue)
    }, [currentNumberValue])

    const setOption = (value: ListSelect | null) => {
        setSelectedOption(value)
        onChangeOptionValue(value?.label ?? "")
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
        onChangeNumberValue?.(event.target.value)
    }

    const displayNumber =currentOptionValue.value === 0 ? 0 : Number(currentOptionValue.value).toFixed(6)

    return (
        <div style={{ gap: 6, ...customStyles }}>
            <label>{title}</label>
            <div style={styles.viewInput}>
                <Select
                    inputId={`${testId}_select`}
                    value={selectedOption}
                    placeholder="Token"
                    onChange={setOption}
                    options={listOptions}
                    components={{ Option: CustomOption, SingleValue: CustomSelectValue }}
                    styles={{
                        option: provided => ({
                            ...provided,
                            color: 'black',
                            alignItems: "center",
                            display: "flex",
                            gap: "4px"
                        }),
                        singleValue: provided => ({
                            ...provided,
                            color: 'black',
                            alignItems: "center",
                            display: "flex",
                            gap: "4px"
                        }),
                        control: provided => ({
                            ...provided,
                            borderWidth: 0,
                            width: 100
                        }),
                        dropdownIndicator: provided => ({
                            ...provided,
                            display: "none"
                        }),
                    }}
                />
                <input 
                    data-testid={`${testId}_input`}
                    value={value}
                    onChange={onChange}
                    type="number"
                    disabled={isDisabled}
                    placeholder='Amount'
                    style={styles.input}
                />
            </div>
            <span>{`Token value: ${displayNumber}`}</span>
        </div>
    )
})

const styles = {
    viewInput: { 
        display: "flex",
        margin: "6px 0"
    } as React.CSSProperties,
    input: {
        paddingLeft: 10,
        color: "#000"
    } as React.CSSProperties,
}

export default InputComponent