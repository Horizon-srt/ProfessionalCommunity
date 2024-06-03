import { useStore } from '@/hooks/useStore';
import useFetch, { useFetchMutation } from '@/services/use-fetch';
import { ProvideMethod } from '@/types/data-types';
import { Card, Row, Col, Slider, InputNumber, Button, message } from 'antd';
import React, { useEffect, useState } from 'react';

const ResourceSlider = ({ value, setValue, name }: any) => {
  const onChange = (v: number | null) => {
    setValue((obj: any) => {
      return { ...obj, value: v };
    });
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
  const [water, setWater] = useState<any>({ value: 0, id: '' });
  const [elect, setElect] = useState<any>({ value: 0, id: '' });
  const [gas, setGas] = useState<any>({ value: 0, id: '' });

  const uid = useStore(state => state.uid);

  const DefaultPatchAlertParams = {
    url: '/addresses/alert/' + uid,
    method: 'PATCH' as ProvideMethod,
    params: null
  };

  const { data: thresholdData, isLoading: isGetDataLoading } = useFetch(
    uid
      ? {
          url: '/addresses/alert/' + uid,
          method: 'GET' as ProvideMethod,
          params: {}
        }
      : null
  );

  const defaultCreateAlertParams = {
    url: '/address/alert/' + uid,
    method: 'POST' as ProvideMethod,
    params: null
  };
  const { trigger: createAlert } = useFetchMutation(defaultCreateAlertParams);

  useEffect(() => {
    if (isGetDataLoading || !Array.isArray(thresholdData)) return;

    const flag = { ELECTRICITY: false, GAS: false, WATER: false } as Record<
      string,
      boolean
    >;
    for (const data of thresholdData) {
      if (data.type === 'ELECTRICITY') {
        flag.ELECTRICITY = true;
        setElect({
          value: data.value,
          id: data['alert_id']
        });
      } else if (data.type === 'Gas') {
        flag.GAS = true;
        setGas({
          value: data.value,
          id: data['alert_id']
        });
      } else if (data.type === 'WATER') {
        flag.WATER = true;
        setWater({
          value: data.value,
          id: data['alert_id']
        });
      }
    }
    Object.keys(flag).forEach((key: string) => {
      if (!flag[key]) {
        createAlert({
          ...DefaultPatchAlertParams,
          ...{
            params: {
              // 后端bug
              type: key === 'GAS' ? 'Gas' : key,
              value: 50
            }
          }
        });
      }
    });
  }, [thresholdData, isGetDataLoading]);
  const { data: WaterData, trigger: patchWaterAlert } = useFetchMutation(
    DefaultPatchAlertParams
  );
  const { data: ElectData, trigger: patchElectAlert } = useFetchMutation(
    DefaultPatchAlertParams
  );

  const { data: GasData, trigger: patchGasAlert } = useFetchMutation(
    DefaultPatchAlertParams
  );

  const [isPatchData, setIsPatchData] = useState<any>({});
  useEffect(() => {
    setIsPatchData({ w: WaterData, e: ElectData, g: GasData });
    if (isPatchData.w || isPatchData.e || isPatchData.g) {
      message.success('Save Threshold Successfully');
    }

    if (isPatchData.w && isPatchData.e && isPatchData.g) {
      setIsPatchData({});
    }
  }, [WaterData, ElectData, GasData]);
  const onClick = () => {
    patchWaterAlert({
      ...DefaultPatchAlertParams,
      url: '/addresses/alert/' + water.id,
      params: {
        type: 'WATER',
        value: water.value
      }
    });
    patchGasAlert({
      ...DefaultPatchAlertParams,
      url: '/addresses/alert/' + gas.id,

      params: {
        type: 'Gas',
        value: gas.value
      }
    });
    patchElectAlert({
      ...DefaultPatchAlertParams,
      url: '/addresses/alert/' + elect.id,

      params: {
        type: 'ELECTRICITY',
        value: elect.value
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
        <ResourceSlider
          value={water.value}
          setValue={setWater}
          name={'Water'}
        />
        <ResourceSlider
          value={elect.value}
          setValue={setElect}
          name={'Electricity'}
        />
        <ResourceSlider value={gas.value} setValue={setGas} name={'Gas'} />

        <Row className='w-full justify-center'>
          <Button className='-mt-1' onClick={onClick}>
            Save
          </Button>
        </Row>
      </div>
    </Card>
  );
};
