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
            <h1>{{ message }}</h1>
            <h1 wave-condition="message = Hello, world">{{ secretMessage }}</h1>
            <h1 wave-condition="count > 10">more than 10</h1>
            <h1 wave-condition="count < 10">less than 10</h1>
            <h1>Count: {{ count }}</h1>
            <button wave-click="increment">Increment</button>
        </div>
        <script src="wave.js" type="text/javascript"></script>
        <script type="text/javascript">
            const exampleApp = new WaveApp("#app", {
                message: "Hello, world!",
                secretMessage: "My secret message :)",
                count: 5
            }, {
                increment: () => {
                    exampleApp.data.count += 1;
                }
            });
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