{{define "main"}}

{{ range $actualValue := .problems }}
    {{ range $checkItemKey, $checkItemValue := $actualValue }}
        {{ if eq $checkItemKey "actual"}}

| 检查项 | 值 | 状态 |
|:---|:---|:---|{{ range $checkItemValue }}
| {{ .name }} | {{ .value }} | {{ .status }} |{{ end }}

        {{ end }}
    {{ end }}
{{ end }}

{{end}}
