import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

function NotDefined() {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, 这是首页"
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          Back Home
        </Button>
      }
    />
  );
}
export default NotDefined;
