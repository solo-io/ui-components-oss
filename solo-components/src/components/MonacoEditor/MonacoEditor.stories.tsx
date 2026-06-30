import type { Decorator, Meta, StoryObj } from "@storybook/react";
import { Drawer } from "antd";
import { useState } from "react";
import { Button } from "../Button";
import { CloseButton } from "../CloseButton";
import { MonacoEditorWithSettings } from "./MonacoEditorWithSettings";

const meta: Meta<typeof MonacoEditorWithSettings> = {
  title: "Common / MonacoEditor",
  component: MonacoEditorWithSettings,
  args: {
    language: "json",
    height: "100%",
  },
  argTypes: {
    language: {
      control: "select",
      options: ["json", "yaml", "javascript", "typescript", "html", "css"],
    },
    readOnly: { control: "boolean" },
  },
};

// Sizes the inline editor stories; the Drawer story renders just its button.
const editorBox: Decorator = (Story) => (
  <div style={{ height: 360 }}>
    <Story />
  </div>
);
export default meta;

type Story = StoryObj<typeof MonacoEditorWithSettings>;

export const Json: Story = {
  name: "JSON",
  decorators: [editorBox],
  args: {
    language: "json",
    value: `{
  "name": "@solo-io/ui-components-oss",
  "private": false,
  "keep": "the button"
}`,
  },
};

export const Yaml: Story = {
  name: "YAML",
  decorators: [editorBox],
  args: {
    language: "yaml",
    value: `name: example
items:
  - one
  - two
nested:
  enabled: true`,
  },
};

export const ReadOnly: Story = {
  decorators: [editorBox],
  args: {
    language: "typescript",
    readOnly: true,
    value: `export const add = (a: number, b: number): number => a + b;`,
  },
};

const K8S_YAML = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: payments-api
  namespace: payments
  labels:
    app.kubernetes.io/name: payments-api
    app.kubernetes.io/instance: payments-api
    app.kubernetes.io/version: "1.8.3"
    app.kubernetes.io/component: api
    app.kubernetes.io/part-of: payments-platform
    app.kubernetes.io/managed-by: helm
  annotations:
    kubernetes.io/change-cause: "Deploy v1.8.3"
    prometheus.io/scrape: "true"
    prometheus.io/port: "9090"
spec:
  replicas: 3
  revisionHistoryLimit: 5
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app.kubernetes.io/name: payments-api
  template:
    metadata:
      labels:
        app.kubernetes.io/name: payments-api
        app.kubernetes.io/instance: payments-api
    spec:
      serviceAccountName: payments-api
      securityContext:
        runAsNonRoot: true
        runAsUser: 10001
        fsGroup: 10001
      containers:
        - name: api
          image: registry.example.com/payments/payments-api:1.8.3
          imagePullPolicy: IfNotPresent
          ports:
            - name: http
              containerPort: 8080
            - name: metrics
              containerPort: 9090
          env:
            - name: LOG_LEVEL
              value: info
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: payments-db
                  key: url
            - name: REDIS_HOST
              value: redis.payments.svc.cluster.local
          resources:
            requests:
              cpu: 250m
              memory: 256Mi
            limits:
              cpu: "1"
              memory: 512Mi
          readinessProbe:
            httpGet:
              path: /healthz/ready
              port: http
            initialDelaySeconds: 5
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /healthz/live
              port: http
            initialDelaySeconds: 15
            periodSeconds: 20
          volumeMounts:
            - name: config
              mountPath: /etc/payments
              readOnly: true
      volumes:
        - name: config
          configMap:
            name: payments-api-config
`;

// Demonstrates the common "view a resource" pattern: a button opens a Drawer
// with the editor in read-only mode. The manifest is long enough to scroll,
// which also shows the controls shifting clear of the vertical scrollbar.
const ViewYamlDrawer = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button color="dark-purple" onClick={() => setOpen(true)}>
        View YAML
      </Button>
      <Drawer
        title="payments-api.deployment.yaml"
        placement="right"
        width={680}
        open={open}
        onClose={() => setOpen(false)}
        closable={false}
        extra={<CloseButton aria-label="Close" onClick={() => setOpen(false)} />}
        styles={{ body: { padding: 0 } }}
      >
        <MonacoEditorWithSettings
          value={K8S_YAML}
          language="yaml"
          readOnly
          height="100%"
        />
      </Drawer>
    </>
  );
};

export const ViewInDrawer: Story = {
  name: "View YAML in Drawer",
  render: () => <ViewYamlDrawer />,
};
