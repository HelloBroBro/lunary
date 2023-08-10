import { Group, Progress, Table, Text } from "@mantine/core"

type BarListProps = {
  data: any[]
  customMetric?: {
    value: number
    label: string
  }
  columns: {
    name: string
    key?: string
    main?: boolean // Use this column for the bar chart calculations?
    bar?: boolean // Bar chart column ?
    render?: (value) => React.ReactNode
  }[]
}

// A table of progress bars, with the progress value the proportion relative to the total
// and the second column the value of the bar
const BarList = ({ data, columns, customMetric }: BarListProps) => {
  const dataColumns = columns.filter((col) => !col.bar)
  const main = dataColumns.find((col) => col.main) || dataColumns[0]
  const mainTotal = data.reduce((acc, item) => acc + (item[main.key] || 0), 0)

  console.log({ main, mainTotal, dataColumns })

  if (!data) return <>No data.</>

  return (
    <>
      {customMetric ? (
        <Group align="end" my="lg" spacing={8}>
          <Text fw={700} fz={30} lh={1}>
            {customMetric.value}
          </Text>
          <Text c="dimmed" size={"sm"} lh={1.3}>
            {customMetric.label}
          </Text>
        </Group>
      ) : (
        <Group spacing="lg">
          {dataColumns.map(({ key, name, render }, i) => {
            const total = data.reduce((acc, item) => acc + (item[key] || 0), 0)

            return (
              <Group align="end" my="lg" spacing={8} key={i}>
                <Text fw={700} fz={30} lh={1}>
                  {render ? render(total) : total}
                </Text>
                <Text c="dimmed" size={"sm"} lh={1.3}>
                  {name.toLowerCase()}
                </Text>
              </Group>
            )
          })}
        </Group>
      )}

      <Table
        cellPadding={0}
        horizontalSpacing={0}
        withBorder={false}
        verticalSpacing={10}
        variant="unstyled"
      >
        <thead>
          <tr>
            {columns.map(({ name }, i) => (
              <th key={i}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data
            .sort((a, b) => b[main.key] - a[main.key])
            .filter((item) => item[main.key] > 0)
            .splice(0, 5)
            .map((item, index) => (
              <tr key={index}>
                <td className="progressTd">
                  <Progress
                    size="lg"
                    h={25}
                    sections={item.barSections?.map(
                      ({ count, color, tooltip }) => ({
                        value: (count / mainTotal) * 100,
                        color: color + ".4",
                        tooltip,
                      })
                    )}
                    w={"90%"}
                    radius="md"
                    value={(item[main.key] / mainTotal) * 100}
                  />
                  <Text>{item.value}</Text>
                </td>
                {dataColumns.map(({ key, render }, i) => (
                  <td key={i}>
                    <Text>{render ? render(item[key]) : item[key]}</Text>
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
        <style jsx>{`
          td,
          th {
            border-top: none !important;
            border-bottom: none !important;
          }

          .progressTd {
            position: relative;
          }

          .progressTd :global(.mantine-Progress-root) {
            position: absolute;
            left: 0;
            top: 6px;
            bottom: 0;
          }

          .progressTd :global(.mantine-Text-root) {
            z-index: 1;
            position: relative;
            top: -2px;
            left: 50%;
            transform: translateX(-25%);
          }
        `}</style>
      </Table>
    </>
  )
}

export default BarList