export interface CheckboxDropdownOption<T> {
    id: string;
    text: string;
    isChecked: boolean;
    options?: T;
}
