import ReactSwitch from "react-switch";

export default function ToggleButton({
    checked,
    onChange,
}: {
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-center mt-auto mb-4">
            <ReactSwitch
            onChange={onChange}
            checked={checked}
            offColor="#888"
            onColor="#4CAF50"
            handleDiameter={20}
            height={20}
            width={48}
            />
        </div>
    );
}