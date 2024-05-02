import useFetch, { useFetchMutation } from '@/services/use-fetch';
import { ProvideMethod } from '@/types/data-types';
import { Card, Row, Col, Slider, InputNumber, Button, message } from 'antd';
import React, { useEffect, useState } from 'react';

const ResourceSlider = ({ value, setValue, name }: any) => {
  const onChange = (v: number | null) => {
    setValue(v);
  };
  return (
    <Row className='w-full'>
      <Col span={5} className='mt-1'>
        {name}
      </Col>
      <Col span={12}>
        <Slider min={1} max={1000} value={value} onChange={onChange} />
      </Col>
      <Col span={4}>
        <InputNumber
          value={value}
          onChange={onChange}
          min={1}
          max={1000}
          style={{ margin: '0 16px' }}
        />
      </Col>
    </Row>
  );
};
export const Threshold = () => {
  const [messageApi] = message.useMessage();
  const [water, setWater] = useState(0);
  const [elect, setElect] = useState(0);
  const [gas, setGas] = useState(0);

  // 先写死，不确定是context传递还是props传递
  const aid = '1234';
  const DefaultPatchAlertParams = {
    url: '/addresses/resources/' + aid,
    method: 'PATCH' as ProvideMethod,
    params: null
  };

  const { data: thresholdData } = useFetch({
    url: '/addresses/resources/' + aid,
    method: 'GET' as ProvideMethod,
    params: {}
  });

  useEffect(() => {
    if (!thresholdData || !Array.isArray(thresholdData)) return;
    for (const data of thresholdData) {
      if (data.type === 'ELECTRICITY') {
        setElect(data.value);
      } else if (data.type === 'GAS') {
        setGas(data.value);
      } else if (data.type === 'WATER') {
        setWater(data.value);
      }
    }
  }, [thresholdData]);
  const { trigger: patchWaterAlert } = useFetchMutation(
    DefaultPatchAlertParams
  );
  const { trigger: patchElectAlert } = useFetchMutation(
    DefaultPatchAlertParams
  );

  const { trigger: patchGasAlert } = useFetchMutation(DefaultPatchAlertParams);

  // 待优化
  const onClick = () => {
    patchWaterAlert({
      ...DefaultPatchAlertParams,
      params: {
        type: 'WATER',
        value: water
      }
    });
    patchGasAlert({
      ...DefaultPatchAlertParams,
      params: {
        type: 'Gas',
        value: gas
      }
    });
    patchElectAlert({
      ...DefaultPatchAlertParams,
      params: {
        type: 'ELECTRICITY',
        value: elect
      }
    });
    messageApi.open({
      type: 'success',
      content: 'Threshold set successfully'
    });
  };

  return (
    <Card title='Threshold setting'>
      <div className='w-full h-full flex flex-col'>
        <ResourceSlider value={water} setValue={setWater} name={'Water'} />
        <ResourceSlider
          value={elect}
          setValue={setElect}
          name={'Electricity'}
        />
        <ResourceSlider value={gas} setValue={setGas} name={'Gas'} />

        <Row className='w-full justify-center'>
          <Button className='-mt-1' onClick={onClick}>
            Save
          </Button>
        </Row>
      </div>
    </Card>
  );
};
