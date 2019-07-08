import React, { useState, useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';
import {
  Icon, Message, Card, Button, Menu, Loader
} from 'semantic-ui-react';
import { Context } from '../../context/store';

const Home = () => {
  const { credentials, cloud, storage, logout } = useContext(Context);
  const [isLoading, setIsLoading] = useState(() => true);
  const [msgError, setMsgError] = useState(() => '');
  const [devices, setDevices] = useState(() => []);

  const onError = (err) => {
    setIsLoading(() => true);
    setDevices(() => []);
    setMsgError(`${err}. Check the information provided and try again`);
    cloud.close();
    setTimeout(loadDevices, 3000);
  }

  const loadDevices = () => {
    cloud.once('ready', () => {
      cloud.once('devices', (devices) => {
        setDevices(() => devices);
        setIsLoading(() => false);
        setMsgError(() => '');
        cloud.close();
      });
      cloud.getDevices({ type: 'knot:thing' });
    });
    cloud.connect();
  };

  const switchStatus = (deviceId, sensorId, value) => {
    cloud.once('ready', () => {
      cloud.once('sent', () => cloud.close());
      cloud.setData(deviceId, [{ sensorId, value: !value }]);
    });

    cloud.connect();
  }

  const getMostRecentData = async (deviceId, sensorId) => {
    const query = { take: 1, orderBy: 'timestamp', order: -1 };
    const [data] = await storage.listDataBySensor(deviceId, sensorId, query);
    if (data)
      return data.value;
  };

  const createDeviceCard = (device) => {
    const { id } = device.knot;
    const { name } = device.metadata;
    let sensorId;
    if (!device.schema) {
      return null;
    }

    ([{ sensorId }] = device.schema);
    // getMostRecentData(id, sensorId).then((v) => { value = v; });

    return (
      <Card className="online-device" id={id} key={id}>
        <Card.Content className="device-info">
          <Card.Header className="device-name">
            {device.value ? <Icon name="lightbulb outline" color="yellow" size="big" /> : <Icon name="lightbulb" color="black" size="big" />}
            {name}
            {/* TODO: change to consume storage API */}
          </Card.Header>
          <Card.Meta className="device-id">
            {id}
          </Card.Meta>
        </Card.Content>

        <Card.Content extra>
          <Button type="button" color="green" onClick={() => switchStatus(id, sensorId, device.value)}>
            CHANGE VALUE
          </Button>
        </Card.Content>
      </Card>
    );
  };

  const handleStatusChange = (id, value) => {
    setDevices(prevState => {
      const devices = prevState;
      const updatedDevices = devices.map(device => device.knot.id === id ? { ...device, value } : device);
      return updatedDevices;
    });
  }

  const listenStatusData = () => {
    cloud.on('data', (message) => handleStatusChange(message.from, message.payload.value));
    cloud.connect();
  };

  useEffect(() => { // componentDidMount
    if (credentials.uuid || credentials.token) {
      loadDevices();
      listenStatusData();
      cloud.on('error', onError);
    }

    return function cleanup() {
      // cloud.close();
    }
  }, [cloud]);

  return (
    <div className="App">
      <Menu inverted color="green" size="large">
        <Menu.Item header>KNoT Hello world</Menu.Item>
        <Menu.Item onClick={logout} position="right">Log out</Menu.Item>
      </Menu>
      {!credentials.uuid && !credentials.token && <Redirect to="/login" />}
      <div>
        <div id="devices">
          <h1 className="devices-header">
            DEVICES
          </h1>
          <Card.Group className="device-grid">
            {_.map(devices, createDeviceCard)}
          </Card.Group>
          <Loader active={isLoading} />
          <Message error header={msgError} hidden={_.isEmpty(msgError)} />
        </div>
      </div>
    </div>
  );
}

export default Home;