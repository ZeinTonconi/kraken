import {
  Alert,
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Typography,
} from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { AuthLayout } from "../components/AuthLayout";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { clearError, login } from "../authSlice";

import illustration from "../../../assets/login.png";

const { Title, Text, Link } = Typography;

type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

export function LoginPage() {
  const [form] = Form.useForm<LoginFormValues>();
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);
  const isLoading = status === "loading";

  const onSubmit = async (values: LoginFormValues) => {
    const { email, password } = values;
    dispatch(login({ email, password }));
  };

  const left = (
    <div className="space-y-6">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-indigo-600" />
        <div className="leading-tight">
          <div className="text-base font-semibold text-slate-900">Kraken</div>
          <div className="text-xs text-slate-500">UniJira</div>
        </div>
      </div>

      <div>
        <Title level={2} className="!mb-1 !text-slate-900">
          Welcome back
        </Title>
        <Text className="text-slate-500">
          Inicia sesión para ver tus cursos y avanzar en tu programa.
        </Text>
      </div>

      {/* Google button (opcional) */}
      <Button
        size="large"
        className="w-full"
        icon={<GoogleOutlined />}
        onClick={() => {
          // TODO: OAuth
        }}
      >
        Log in with Google
      </Button>

      <Divider className="!my-2">
        <Text className="text-xs text-slate-400">OR LOGIN WITH EMAIL</Text>
      </Divider>

      <Form<LoginFormValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{ remember: true }}
        onFinish={onSubmit}
        onValuesChange={() => {
          if (error) {
            dispatch(clearError());
          }
        }}
      >
        {error ? (
          <Alert
            message="No pudimos iniciar sesion"
            description={error}
            type="error"
            showIcon
            className="mb-4"
          />
        ) : null}
        <Form.Item
          label={<span className="text-slate-700">Email Address</span>}
          name="email"
          rules={[
            { required: true, message: "Ingresa tu email" },
            { type: "email", message: "Email inválido" },
          ]}
        >
          <Input size="large" placeholder="Email Address" />
        </Form.Item>

        <Form.Item
          label={<span className="text-slate-700">Password</span>}
          name="password"
          rules={[{ required: true, message: "Ingresa tu contraseña" }]}
        >
          <Input.Password size="large" placeholder="Password" />
        </Form.Item>

        <div className="flex items-center justify-between">
          <Form.Item name="remember" valuePropName="checked" className="!mb-0">
            <Checkbox>Keep me logged in</Checkbox>
          </Form.Item>

          <Link className="text-indigo-600">Forgot your password?</Link>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={isLoading}
          disabled={isLoading}
          className="mt-4 w-full !bg-indigo-600 hover:!bg-indigo-500"
        >
          Log in
        </Button>

        <div className="mt-4 text-center">
          <Text className="text-slate-500">Don&apos;t have an account?</Text>{" "}
          <Link className="text-indigo-600">Sign up</Link>
        </div>
      </Form>
    </div>
  );

  return <AuthLayout left={left} illustrationSrc={illustration} />;
}
