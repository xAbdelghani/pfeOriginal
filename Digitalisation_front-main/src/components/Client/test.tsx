/*import { message, Select } from "antd"
import cuid from "cuid"
import { FC, useEffect, useState } from "react"
import { DataGridStore, Icons, SelectedStore, useMStore } from "src/core"
import { MSForms, MSSubmit } from "src/core/FormInputs"
import MSDateInput from "src/core/FormInputs/MSDate"
import MSNumberInput from "src/core/FormInputs/MSNumber"
import MSTextInput from "src/core/FormInputs/MSText"
import { MSTextArea } from "src/core/FormInputs/MSTextArea"
import { orasssms } from "src/intellisense"
import { getAlllisteDetails } from "../services/core"
import { sendService } from "./core"
import MSSelectInputOption from "./SelectInput"
export const ServiceForm: MSForms = new MSForms({
    name: orasssms.sms_input.$name,
})
const { Option } = Select
export const OnDemandServiceForm: FC = () => {
    useMStore(DataGridStore, [orasssms.sms_input.$name])
    const inputs_liste = DataGridStore.get(orasssms.sms_input.$name, [])
    const [details, setDetails] = useState<{ code: any; value: any | number; label: any }[]>([])
    const isValidDate = (dateStr: any) => {
        const datePattern = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/
        return datePattern.test(dateStr)
    }
    const formatDate = (dateStr: any) => {
        const [datePart, timePart] = dateStr.split(" ")
        return `${datePart} ${timePart}`
    }
    useEffect(() => {
        getAlllisteDetails((res: any) => {
            const detailsList = res.details.map((item: any) => ({
                code: item.CODELIST,
                value: item.CODDETLI,
                label: item.LIBDETLS,
            }))
            setDetails(detailsList)
        })
    }, [])
    const send = () => {
        const formInputs = ServiceForm.getInputsValue()
        const gridData = DataGridStore.get(orasssms.sms_selects.$name, [])
        const transformedGridData = gridData.reduce((acc: any, item: any) => {
            acc[item.LABEL] = item.CODE
            return acc
        }, {})
        const combinedData = {
            ...formInputs,
            ...transformedGridData, // Add transformed grid data to parameters
        }
        ServiceForm.setInputsValue(orasssms.sms_input.$name, combinedData)
        console.log("combined data", combinedData)
        const requiredInputs = inputs_liste.filter((input: any) => input.VALUREQU === "O")
        for (const input of requiredInputs) {
            const key = input.COLUNAME
            console.log("Key", key)
            console.log("value in combined", combinedData[key])
            if (!combinedData[key]) {
                console.log(`L'élément requis "${input.LIBEINPU}" est manquant.`)
                message.error("Veuillez saisir tous les champs requis")
                return
            }
        }
        ServiceForm.validateFields((combinedData: any) => {
            Object.entries(combinedData).forEach(([key, value]) => {
                if (typeof value === "string" && isValidDate(value)) {
                    combinedData[key] = formatDate(value)
                }
            })
            sendService(
                {
                    CODEREQU: SelectedStore.get(orasssms.sms_service.$name, {}).CODEREQU,
                    PARAMETERS: [combinedData],
                    IDENSERVE: SelectedStore.get(orasssms.sms_service.$name, {}).IDENSERV,
                },
                (res: any) => {
                    console.log("response:", res)
                    if (res["status"] === "warning") {
                        message.warning(res["message"], 2)
                        return
                    } else if (res["status"] === "error") {
                        message.error(res["message"], 2)
                        return
                    }
                    message.success("Validé avec succès!", 2)
                }
            )
        })
    }
    return (
        <ServiceForm.UI>
            {inputs_liste.length > 0 ? (
                inputs_liste.map((input: any) => {
                    const inputName = `${orasssms.sms_input.$name}.${input.COLUNAME}`
                    console.log("Input:", input)
                    switch (input.CODTYPIN) {
                        case "T":
                            console.log("text required:", inputName)
                            return (
                                <MSTextInput
                                    key={input.NUMBCOLU}
                                    name={inputName}
                                    label={input.LIBEINPU}
                                    col={input.NUMBCOLU}
                                    placeholder={input.PLACHOLD}
                                    required={() => input.VALUREQU === "O"}
                                />
                            )
                        case "D":
                            console.log("date required:", input.VALUREQU)
                            return (
                                <MSDateInput
                                    key={input.NUMBCOLU}
                                    name={inputName}
                                    label={input.LIBEINPU}
                                    col={input.NUMBCOLU}
                                    required={() => input.VALUREQU === "O"}
                                    placeholder={input.PLACHOLD}
                                />
                            )
                        case "N":
                            console.log("number required:", input.VALUREQU)
                            return (
                                <MSNumberInput
                                    key={input.NUMBCOLU}
                                    name={inputName}
                                    label={input.LIBEINPU}
                                    col={input.NUMBCOLU}
                                    required={() => input.VALUREQU === "O"}
                                    placeholder={input.PLACHOLD}
                                />
                            )
                        case "S":
                            console.log("select required:", input.VALUREQU)
                            return <MSSelectInputOption key={cuid()} input={input} onChange={(v: any) => {}} />
                        case "A":
                            console.log("textarea required:", input.VALUREQU)
                            return (
                                <MSTextArea
                                    key={input.NUMBCOLU}
                                    name={inputName}
                                    label={input.LIBEINPU}
                                    col={input.NUMBCOLU}
                                    required={() => input.VALUREQU === "O"}
                                    placeholder={input.PLACHOLD}
                                />
                            )
                        case "M":
                            console.log("phone required:", input.VALUREQU)
                            return (
                                <MSNumberInput
                                    key={input.NUMBCOLU}
                                    name={inputName}
                                    label={input.LIBEINPU}
                                    col={input.NUMBCOLU}
                                    required={() => input.VALUREQU === "O"}
                                    placeholder={input.PLACHOLD}
                                    minDigits={7}
                                />
                            )
                        default:
                            return null
                    }
                })
            ) : (
                <></>
            )}
            {inputs_liste.length > 0 && (
                <MSSubmit key="submit-button" text={"Valider"} type="primary" icon={<Icons.CheckCircleFilled />} onClick={send} />
            )}
        </ServiceForm.UI>
    )
}*/
Text input:
import { Input } from "antd"
import { Rule } from "antd/lib/form"
import * as React from "react"
import { MSTools } from "../MSTools"
import { FormInputInterface } from "./MSFormItem"
import { MSFormItem } from "./MSFormItem"
import { SizeType } from "antd/lib/config-provider/SizeContext"
export interface TextInputInterface extends FormInputInterface {
    prefix?: React.ReactNode
    addonAfter?: string | React.ReactNode
    password?: boolean,
    size?: SizeType
}
export const MSText: React.FC<TextInputInterface> = (props: TextInputInterface) => {
    const readOnly = MSTools.exec(props.readOnly || props.disabled)
    const onBlur = (e: any) => {
        props.onBlur && props.onBlur(e)
    }
    const onChange = (e: any) => {
        props.form?.setInputValue(props.name, e.target.value)
        props.onChange && props.onChange(e.target.value)
    }
    const onSubmit = (e: any) => {
        props.onSubmit && props.onSubmit(e.target.value, e)
    }
    const onPressEnter = (e: any) => {
        props.onPressEnter && props.onPressEnter(e.target.value, e)
    }
    return props.password ? (
        <Input.Password
            placeholder={props.placeholder}
            readOnly={readOnly}
            disabled={readOnly}
            value={props.form?.getInputValue(props.name)}
            style={{ width: "100%", ...props.style }}
            maxLength={props.maxLength}
            onBlur={onBlur}
            size={props.size}
            onChange={onChange}
            onSubmit={onSubmit}
            onPressEnter={onPressEnter}
            addonAfter={props.addonAfter}
            onFocus={()=>{
                props.form?.setLastSelectedInput(props.name)
            }}
        />
    ) : (
        <Input
            prefix={props.prefix}
            placeholder={props.placeholder}
            readOnly={readOnly}
            disabled={readOnly}
            value={props.form?.getInputValue(props.name)}
            style={{ width: "100%", ...props.style, fontWeight: 'bold' }}
            size={props.size}
            maxLength={props.maxLength}
            onBlur={onBlur}
            onChange={onChange}
            type={props.htmlType}
            onSubmit={onSubmit}
            onPressEnter={onPressEnter}
            addonAfter={props.addonAfter}
            onFocus={()=>{
                props.form?.setLastSelectedInput(props.name)
            }}
        />
    )
}
const MSTextInput: React.FC<TextInputInterface> = (props: TextInputInterface) => {
    const rules: Rule[] = [...(props.rules || [])]
    return (
        <MSFormItem {...props} type="text" rules={rules}>
            <MSText {...props} />
        </MSFormItem>
    )
}
export default MSTextInput

Number input
import { InputNumber,Form,Input } from "antd"
import { SizeType } from "antd/lib/config-provider/SizeContext"
import { Rule } from "antd/lib/form"
import Text from "antd/lib/typography/Text"
import React from "react"
import { orassapp } from "src/intellisense"
import { SharedStore } from ".."
import { MSTools } from "../MSTools"
import { FormInputInterface, MSFormItem } from "./MSFormItem"
export interface NumberInputInterface extends FormInputInterface {
    numberType?: "currency" | null
    prefix?: React.ReactNode
    size?: SizeType
    maxDigits?: number // Add maxDigits property
    minDigits?: number // Add minDigits property
}
export const MSNumber: React.FC<NumberInputInterface> = (props: NumberInputInterface) => {
    const readOnly = MSTools.exec(props.readOnly || props.disabled)
    let AddonAfter: any = null
    if (props.numberType === "currency") {
        AddonAfter = <Text strong>{SharedStore.get(orassapp.config.MONNSOCI)}</Text>
    }
    const onSubmit = (e: any) => {
        props.onSubmit && props.onSubmit(e.target.value, e)
    }
    const onPressEnter = (e: any) => {
        if (e.charCode === 13) {
            props.onPressEnter && props.onPressEnter(e.target.value, e)
        }
    }
    // Custom formatter and parser to handle maxDigits and minDigits
    const formatter = (value: any) => {
        if (value) {
            let stringValue = value.toString()
            if (props.maxDigits && stringValue.length > props.maxDigits) {
                stringValue = stringValue.slice(0, props.maxDigits)
            }
            return MSTools.switchf(props.numberType || "", {
                currency: `${MSTools.numberFormat(stringValue)}`,
                default: MSTools.numberFormat(stringValue),
            })
        }
        return value
    }
    const parser = (value: any) => {
        if (value) {
            let stringValue = value.toString()
            if (props.maxDigits && stringValue.length > props.maxDigits) {
                stringValue = stringValue.slice(0, props.maxDigits)
            }
            return MSTools.switchf(props.numberType || "", {
                currency: MSTools.numberParse(stringValue),
                default: MSTools.numberParse(stringValue),
            })
        }
        return value
    }
    return (
        <InputNumber
            prefix={props.prefix}
            size={props.size}
            onKeyPress={onPressEnter}
            onSubmit={onSubmit}
            addonAfter={AddonAfter || props.addonAfter}
            placeholder={props.placeholder}
            defaultValue={MSTools.exec(props.defaultValue)}
            readOnly={readOnly}
            disabled={readOnly}
            formatter={formatter}
            parser={parser}
            style={{ width: "100%", ...props.style }}
            value={props.form?.getInputValue(props.name)}
            onChange={(value: any) => {
                props.form?.setInputValue(props.name, value)
                props.onChange && props.onChange(value)
            }}
            onBlur={(e: any) => {
                props.onBlur && props.onBlur(e)
            }}
            min={MSTools.exec(props.min)}
            max={MSTools.exec(props.max)}
            onFocus={() => {
                props.form?.setLastSelectedInput(props.name)
            }}
        />
    )
}
const MSNumberInput: React.FC<NumberInputInterface> = (props: NumberInputInterface) => {
    const rules: Rule[] = [
        {
            type: "number",
        },
        {
            validator: (_, value) => validateMinDigits(value),
        },
        ...(props.rules || []),
    ]
    const validateMinDigits = (value: any) => {
        if (props.minDigits && value) {
            const stringValue = value.toString()
            if (stringValue.length < props.minDigits) {
                return Promise.reject(
                    new Error(`Le numéro doit comporter au moins ${props.minDigits} chiffres!`)
                )
            }
        }
        return Promise.resolve()
    }
    return (
        <Form validateTrigger={"onBlur"}>
        <MSFormItem {...props} type="number" rules={rules}>
            <MSNumber {...props} />
        </MSFormItem>
        </Form>
    )
}
export default MSNumberInput