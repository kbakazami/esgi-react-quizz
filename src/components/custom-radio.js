export default function CustomRadio({id, name, value, classLi = ''}) {

    return (
        <li className={classLi}>
            <input type={"radio"} id={id} name={name} className={"btn primary"} value={id}></input>
            <label htmlFor={id}>{value}</label>
        </li>
    )
}