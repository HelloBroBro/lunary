import { useApps } from "@/utils/supabaseHooks"
import {
  Anchor,
  Button,
  Card,
  Code,
  Group,
  Loader,
  Mark,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core"

import { CopyButton, ActionIcon, Tooltip } from "@mantine/core"
import { IconCopy, IconCheck } from "@tabler/icons-react"
import { useUser } from "@supabase/auth-helpers-react"
import { useContext, useState } from "react"
import Link from "next/link"
import { AppContext } from "@/utils/context"

export default function Home() {
  const [modalOpened, setModalOpened] = useState(false)
  const [newAppName, setNewAppName] = useState("")
  const { setApp } = useContext(AppContext)

  const { apps, insert, loading } = useApps()
  const user = useUser()

  return (
    <Stack>
      <Title>llmonitor</Title>
      <Text>
        Open-source observability for <Mark>LLM-powered apps</Mark>.
      </Text>

      {loading && <Loader />}

      {apps && !apps.length ? (
        <Card p="xl" w={600} withBorder>
          <Stack align="start">
            <Title order={3}>
              Start by adding an app to get a tracking ID.
            </Title>
            <Button
              size="md"
              onClick={() => {
                setModalOpened(true)
              }}
            >
              + Create one
            </Button>
          </Stack>
        </Card>
      ) : (
        <Group position="apart">
          <Title order={3}>Your Apps</Title>
          <Button
            onClick={() => {
              setModalOpened(true)
            }}
          >
            + New app
          </Button>
        </Group>
      )}

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="New app"
      >
        <Group>
          <TextInput
            placeholder="App name"
            value={newAppName}
            onChange={(e) => setNewAppName(e.currentTarget.value)}
          />
          <Button
            onClick={async () => {
              // @ts-ignore
              await insert({ name: newAppName, owner: user.id })

              setModalOpened(false)
            }}
          >
            Create
          </Button>
        </Group>
      </Modal>
      <Stack>
        {apps?.map((app) => (
          <Anchor
            href={`/analytics`}
            key={app.id}
            component={Link}
            onClick={() => {
              setApp(app)
            }}
          >
            <Card key={app.id}>
              <Title order={4}>{app.name}</Title>
              <Group>
                <Text>
                  Tracking ID: <Code color="pink">{app.id}</Code>
                </Text>
                <CopyButton value={app.id} timeout={2000}>
                  {({ copied, copy }) => (
                    <Tooltip
                      label={copied ? "Copied" : "Copy"}
                      withArrow
                      position="right"
                    >
                      <ActionIcon
                        color={copied ? "pink" : "gray"}
                        onClick={copy}
                      >
                        {copied ? (
                          <IconCheck size="1rem" />
                        ) : (
                          <IconCopy size="1rem" />
                        )}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              </Group>
            </Card>
          </Anchor>
        ))}
      </Stack>
    </Stack>
  )
}
