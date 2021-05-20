import React, { memo, useCallback, useState } from 'react';
import styled from 'styled-components';
import { Radio } from 'antd';

const Container = styled.div`

`
interface colSpaceProps {
    value?: string;
    onChange?: (v: string) => void
}

const options = [
    { label: '25', value: '1' },
    { label: '50', value: '2' },
    { label: '75', value: '3' },
    { label: '100', value: '4' },
]

const ColSpace = (props: colSpaceProps) => {
    const { value, onChange } = props;
    const [selectValue, setSelectValue] = useState<string>((value as string));
    const handleChange = useCallback((e) => {
        setSelectValue(e.target.value);
        onChange && onChange(e.target.value);
    }, [onChange])
    return (
        <Container>
            <Radio.Group
                options={options}
                onChange={handleChange}
                value={selectValue}
                optionType="button"
            />
        </Container>
    )
}

export default memo(ColSpace);
