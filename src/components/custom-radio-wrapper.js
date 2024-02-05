import CustomRadio from "@/components/custom-radio";

export default function CustomRadioWrapper({classUl, data, classLi = ''}) {

    return (
        <ul className={`flex flex-row gap-x-6 ${classUl}`}>
            {
                data.map((value) => {
                    return (
                        <CustomRadio id={value.id} name={value.name} value={value.value} classLi={classLi}/>
                    );
                })
            }
        </ul>
    )
}