import Head from "next/head";
import Image from "next/image";
import React from "react";
import {
  Container,
  css,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import { categories, Emoticon, EmoticonCategoryData } from "../src/data";
import copy from "copy-to-clipboard";

interface TabPanelProps extends React.ComponentProps<"div"> {
  selected: string;
  // value: string;
  data: EmoticonCategoryData;
}

function EmoticonButton({ emo }: { emo: Emoticon }) {
  const [copied, setCopied] = React.useState(false);

  return (
    <Tooltip
      title={
        copied ? (
          <div style={{ textAlign: "center" }}>
            {emo.value}
            <br />
            复制成功
          </div>
        ) : (
          emo.value
        )
      }
      arrow
      onClose={() => setCopied(false)}
    >
      <IconButton
        aria-label={emo.value}
        size="large"
        onClick={() => {
          const url = new URL(emo.url, window.location.href).href;
          copy(url, { format: "text/plain", onCopy: () => setCopied(true) });
        }}
      >
        {/* <Image src={emo.url} alt={emo.value} width={28} height={28} /> */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={emo.url} alt={emo.value} width="28" height="28" />
      </IconButton>
    </Tooltip>
  );
}

function TabPanel({ children, selected, data, ...other }: TabPanelProps) {
  const category = data.key;
  const show = category === selected;

  // const [baseUrl, setBaseUrl] = React.useState("");
  // React.useEffect(() => {
  //   setBaseUrl(window.location.href);
  // }, []);

  return (
    <div
      role="tabpanel"
      hidden={!show}
      id={`emoticon-tabpanel-${category}`}
      aria-labelledby={`emoticon-tab-${category}`}
      {...other}
    >
      {show && (
        <Stack direction="row" spacing={0} flexWrap="wrap">
          {data.value.map((emo) => {
            return <EmoticonButton key={emo.value} emo={emo} />;
          })}
        </Stack>
      )}
    </div>
  );
}

export default function Home() {
  const [cate, setCate] = React.useState<string>(categories[0].key);

  return (
    <Container maxWidth="lg">
      <div
        css={css`
          text-align: center;
          margin-top: 32px;
        `}
      >
        <Typography variant="h4" component="h1">
          微博表情
        </Typography>
        <div
          css={css`
            margin-top: 8px;
          `}
        >
          <a
            href="https://github.com/EqualMa/weibo-emoji"
            target="_blank"
            rel="noreferrer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="GitHub stars"
              src="https://img.shields.io/github/stars/EqualMa/weibo-emoji?color=%23d52c2b&label=github%20STARS&logo=github&style=for-the-badge"
            />
          </a>
        </div>
        <Typography variant="overline">点击表情可复制图片链接</Typography>
      </div>
      <Paper
        sx={{
          padding: "0 8px 8px 8px",
          margin: "8px auto",
          maxWidth: "640px",
          minHeight: "548px",
        }}
        elevation={2}
      >
        <Tabs
          value={cate}
          onChange={(_, c) => setCate(c)}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          aria-label="微博表情分类标签栏"
        >
          {categories.map((c) => (
            <Tab
              key={c.key}
              value={c.key}
              icon={
                c.url ? (
                  <Image src={c.url} alt={c.key} width={28} height={28} />
                ) : undefined
              }
              iconPosition="top"
              label={c.key}
            />
          ))}
        </Tabs>
        {categories.map((c) => (
          <TabPanel key={c.key} selected={cate} data={c} />
        ))}
      </Paper>
    </Container>
  );
}
