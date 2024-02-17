## 🌊 Wave.js
A pure-js framework for frontend development

### Usage
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Wave.js app</title>
    </head>
    <body>
        <div id="app">
            <h1>You have clicked the button {{ count }} times.</h1>
            <button wave-event:click="increment(1)">Click</button>
            <button wave-event:click="toggleSecretMessage()">Toggle Secret Message</button>
            <h4 wave-condition="count >= 10">You have clicked the button over 10 times!</h4>
            <h4 wave-condition="displaySecretMessage = true">This is the secret message!</h4>
        </div>
        <script src="wave.js" type="text/javascript"></script>
        <script type="text/javascript">
            // Interval between updating DOM variables in milliseconds
            const dataRefreshRate = 100;

            const exampleApp = new WaveApp(dataRefreshRate);

            exampleApp.useStore(new WaveAppStore({
                data: {
                    count: 0,
                    displaySecretMessage: false
                },
                methods: {
                    increment: (amount) => {
                        exampleApp.store.data.count += amount;
                    },
                    toggleSecretMessage: () => {
                        exampleApp.store.data.displaySecretMessage = !exampleApp.store.data.displaySecretMessage;
                    }
                }
            }));

            exampleApp.mount("#app");
        </script>
    </body>
</html>
```

### Logical Operators (wave-condition)
- `=` Equal to
- `>` More than
- `>=` More than or equal to
- `<` Less than
- `<=` Less than or equal to

### Events (wave-event)
- `click` Triggers on mouse click
- `input` Triggers when an element recieves input
- `change` Triggers on element's value change