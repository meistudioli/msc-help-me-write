# msc-help-me-write

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/msc-help-me-write) [![DeepScan grade](https://deepscan.io/api/teams/16372/projects/25147/branches/781766/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=16372&pid=25147&bid=781766)

「OpenAI」 is so powerful for all kinds services. That's why I try to adopt OpenAI to help Y! Auction's seller submit merchandise quickly.

With &lt;msc-help-me-write /> support, developers just need to set some configs and everything will be all set. All user need to do is just press the trigger and &lt;msc-help-me-write /> will display cool appearance for pick up.

![<msc-help-me-write />](https://blog.lalacube.com/mei/img/preview/msc-help-me-write.png)

## Basic Usage

&lt;msc-help-me-write /> is a web component. All we need to do is put the required script into your HTML document. Then follow &lt;msc-help-me-write />'s html structure and everything will be all set.

- Required Script

```html
<script
  type="module"
  src="https://your-domain/wc-msc-help-me-write.js">        
</script>
```

- Structure

Put &lt;msc-help-me-write /> into HTML document. It will have different functions and looks with attribute mutation.

```html
<msc-help-me-write>
  <script type="application/json">
    {
      "l10n": {
        "title": "Assistant",
        "apply": "Apply",
        "applied": "Applied",
        "applyAll": "Apply All"
      },
      "webservice": {
        "url": "https://your-domain/api",
        "params": {
          "id": "mei",
          "sex": "M"
        },
        "headers": {
          "content-type": "application/json"
        },
        "method": "POST",
        "withCredentials": false,
        "timeout": 30000
      }
    }
  </script>
</msc-help-me-write>
```

Otherwise, developers could also choose remoteconfig to fetch config for &lt;msc-help-me-write />.

```html
<msc-help-me-write
  remoteconfig="https://your-domain/api-path"
>
</msc-help-me-write>
```

## JavaScript Instantiation

&lt;msc-help-me-write /> could also use JavaScript to create DOM element. Here comes some examples.

```html
<script type="module">
import { MscHelpMeWrite } from 'https://your-domain/wc-msc-help-me-write.js';

// use DOM api
const nodeA = document.createElement('msc-help-me-write');
document.body.appendChild(nodeA);
nodeA.l10n = {
  title: 'AI Assistant',
  apply: 'apply'
};
nodeA.webservice = {
  url: 'https://your-domain/api',
  method: 'GET',
  timeout: 10000
};

// new instance with Class
const nodeB = new MscHelpMeWrite();
document.body.appendChild(nodeB);
nodeB.l10n = {
  title: 'AI Assistant',
  apply: 'apply'
};
nodeB.webservice = {
  url: 'https://your-domain/api',
  method: 'GET',
  timeout: 10000
};

// new instance with Class & default config
const config = {
  {
    "l10n": {
      "title": "Assistant",
      "apply": "Apply",
      "applied": "Applied",
      "applyAll": "Apply All"
    },
    "webservice": {
      "url": "https://your-domain/api",
      "params": {
        "id": "mei",
        "sex": "M"
      },
      "headers": {
        "content-type": "application/json"
      },
      "method": "POST",
      "withCredentials": false,
      "timeout": 30000
    }
  }
};

const nodeC = new MscHelpMeWrite(config);
document.body.appendChild(nodeC);
</script>
```

## API response

&lt;msc-help-me-write /> will need api response the following payload. Both 「`title`」 and 「`content`」 need to set in each unit.

```JSON
{
  "units": [
    {
      "title": "xxxxx",
      "content": "xxxxx",
      ...
      ...
      ...
    },
    {
      "title": "xxxxx",
      "content": "xxxxx",
      ...
      ...
      ...
    },
    ...
    ...
    ...
  ]
}
```

## Style Customization

Developers could apply styles to decorate &lt;msc-help-me-write />'s looking.

```html
<style>
msc-help-me-write {
  --msc-help-me-write-trigger-size: 48px;
  --msc-help-me-write-trigger-icon-scale: 1;
  --msc-help-me-write-shadow-color-rgb: 0 0 0;

  /* window */
  --msc-help-me-write-window-inline-size: 360px;
  --msc-help-me-write-window-block-size: 50dvh;
  --msc-help-me-write-window-border-radius: 16px;
  --msc-help-me-write-window-padding: 12px;
  --msc-help-me-write-window-bgc: rgba(255 255 255);
  --msc-help-me-write-window-border-color: transparent;
  --msc-help-me-write-scrollbar-thumb-color: rgba(0 0 0/.2);
  --msc-help-me-write-window-subject-color: rgba(35 42 49);
  --msc-help-me-write-window-subject-bgc: rgba(240 243 245);
  --msc-help-me-write-window-cancel-color: #5f6368;
  --msc-help-me-write-window-cancel-overlay-color-rgb: 224 228 233;
  --msc-help-me-write-transition-duration: 450ms;

  /* result */
  --msc-help-me-write-divide-line-color: rgba(0 0 0/.15);
  --msc-help-me-write-result-title-color: rgba(35 42 49);
  --msc-help-me-write-result-content-color: rgba(91 99 106);
  --msc-help-me-write-result-content-bgc: rgba(245 248 250);
  --msc-help-me-write-result-content-border-color: rgba(0 0 0/.1);
  --msc-help-me-write-result-apply-color: rgba(15 105 255);
  --msc-help-me-write-result-agent-color: rgba(253 97 0);
}
</style>
```

## Attributes

&lt;msc-help-me-write /> supports some attributes to let it become more convenience & useful.

- **l10n**

Set localization for &lt;msc-help-me-write />. It will replace some content & button text to anything you like. It should be JSON string Developers could set `title`、`apply`、`applied` and `applyAll` here.

- `title`：Set window title. Default is `Assistant`.
- `apply`：Set apply button text. Default is `Apply`.
- `applied`：Set apply button text（user pressed）. Default is `Applied`.
- `applyAll`：Set apply all button text. This button showed only when results > 1. Default is `Apply All`.

```html
<msc-help-me-write
  l10n='{"title":"Assistant","apply":"Apply","applied":"Applied","applyAll":"Apply All"}'
>
  ...
</msc-help-me-write>
```

- **webservice**

Set web service information for &lt;msc-help-me-write />. It should be JSON string. Developers could set `url`、`params`、`headers`、`method`、`withCredentials` and `timeout` here.

- `url`：api address for upload image. Default is `/`.
- `params`：Set parameters. Each of them will be attached with fetch. Default is `{}`.
- `headers`：Set fetch header. Default is `{}`.
- `method`：Set method for fetch. Default is `POST`.
- `withCredentials`：Set withCredentials for fetch. Default is `false`.
- `timeout`：Set timeout for fetch. Default is `30000` (ms).

```html
<msc-help-me-write
  webservice='{"url":"/","params":{},"headers":{},"method":"POST","withCredentials":false,"timeout":30000}'
>
  ...
</msc-help-me-write>
```

## Properties

| Property Name | Type | Description |
| ----------- | ----------- | ----------- |
| l10n | Object | Getter / Setter for l10n. It will replace some UI text to anything you like. Developers could set `title`、`apply`、`applied` and `applyAll`. |
| webservice | Object | Getter / Setter for web service information. Developers could set `url`、`params`、`headers`、`method`、`withCredentials` and `timeout`. |

## Method

| Method Signature | Description |
| ----------- | ----------- |
| query(params = {}) | Go fetch suggestions with parameters you liked. Window will pop up when api success response. This is an async method. <br /><br /> Such as：`element.query({ title:'show me the money' })`  |
| refresh() | Correct trigger's display position. |
| dismiss() | Dissmiss window. |

## Event

| Event Signature | Description |
| ----------- | ----------- |
| msc-help-me-write-apply |Fired when user apply suggestion. Developers could get data througn `event.detatil`（complete API response information）. |
| msc-help-me-write-error | Fired when error occured. |
| msc-help-me-write-cancel | Fired when window dismiss. |

## Reference

- [&lt;msc-help-me-write />](https://blog.lalacube.com/mei/webComponent_msc-help-me-write.html)
- [WEBCOMPONENTS.ORG](https://www.webcomponents.org/element/msc-help-me-write)
- [YouTube](https://youtu.be/B8n63o8ob4g)
