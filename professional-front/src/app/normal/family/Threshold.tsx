import { useStore } from '@/hooks/useStore';
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
  const uid = useStore(state => state.uid);

  const DefaultPatchAlertParams = {
    url: '/addresses/resources/' + uid,
    method: 'PATCH' as ProvideMethod,
    params: null
  };

  const { data: thresholdData, isLoading: isGetDataLoading } = useFetch({
    url: '/addresses/resources/' + uid,
    method: 'GET' as ProvideMethod,
    params: {}
  });

  const defaultCreateAlertParams = {
    url: '/address/alert/' + uid,
    method: 'POST' as ProvideMethod,
    params: null
  };
  const { trigger: createAlert } = useFetchMutation(defaultCreateAlertParams);
  useEffect(() => {
    if (!isGetDataLoading || !Array.isArray(thresholdData)) return;
    const flag = { ELECTRICITY: false, GAS: false, WATER: false } as Record<
      string,
      boolean
    >;
    for (const data of thresholdData) {
      if (data.type === 'ELECTRICITY') {
        flag.ELECTRICITY = true;
        setElect(data.value);
      } else if (data.type === 'GAS') {
        flag.GAS = true;
        setGas(data.value);
      } else if (data.type === 'WATER') {
        flag.WATER = true;
        setWater(data.value);
      }
    }
    Object.keys(flag).forEach((key: string) => {
      if (flag[key]) {
        createAlert({
          ...DefaultPatchAlertParams,
          ...{
            params: {
              type: key,
              value: 50
            }
          }
        });
      }
    });
  }, [thresholdData, isGetDataLoading]);
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
