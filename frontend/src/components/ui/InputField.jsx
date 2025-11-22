// src/components/ui/InputField.jsx

import React from 'react';

const InputField = ({ label, name, type = 'text', value, onChange, ...props }) => {
    const InputElement = type === 'textarea' ? 'textarea' : 'input';

    return (
        <div className="input-group">
            <label htmlFor={name} className="input-label">
                {label}
            </label>
            <InputElement
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                className="input-field"
                {...props}
            />
            <style jsx>{`
                .input-group {
                    margin-bottom: 15px;
                    display: flex;
                    flex-direction: column;
                }
                .input-label {
                    color: var(--color-text-dark); /* BG/700 */
                    margin-bottom: 5px;
                }
                .input-field {
                    padding: 10px;
                    border: 1px solid var(--color-text-medium);
                    border-radius: 4px;
                    background-color: var(--color-bg-light); /* BG/300 */
                    color: var(--color-text-dark);
                }
                .input-field:focus {
                    outline: none;
                    border-color: var(--color-primary); 
                    box-shadow: 0 0 0 1px var(--color-primary);
                }
                textarea.input-field {
                    resize: vertical;
                    min-height: 100px;
                }
            `}</style>
        </div>
    );
};

export default InputField;