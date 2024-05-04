import Checkbox from "expo-checkbox";
import { useState } from "react";

const CheckBox = (props: any) => {
  const [checked, setChecked] = useState<boolean>(false);

  return (
    <Checkbox
      style={props.style}
      value={checked}
      onValueChange={() => {
        setChecked(!checked);
        props.onChecked();
      }}
    />
  );
};

export default CheckBox;
