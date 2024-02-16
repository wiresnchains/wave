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
            <h4 wave-condition="count >= 10">You have clicked the button over 10 times!</h4>
            <button wave-event:click="increment()">Click</button>
        </div>
        <script src="wave.js" type="text/javascript"></script>
        <script type="text/javascript">
            // Interval between updating DOM variables in milliseconds
            const dataRefreshRate = 100;

            const exampleApp = new WaveApp("#app", new WaveAppStore({
                data: {
                    count: 5
                },
                methods: {
                    increment: () => {
                        exampleApp.store.data.count += 1;
                    }
                }
            }), dataRefreshRate);
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

### Events
How to use? Add an `wave-event:type="method()"` attribute to your element. Available event types are listed below.
- `click` Triggers on mouse click
- `input` Triggers when an element recieves input
- `change` Triggers on element's value change