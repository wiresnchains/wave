## 🌊 Wave.js
A pure-js framework for frontend development

### Usage
```html
<body>
    <div id="app">
        <h1>{{ message }}</h1>
    </div>
    <script src="wave.js" type="text/javascript"></script>
    <script type="text/javascript">
        const exampleApp = new WaveApp("#app", {
            message: "This message will change in 5 seconds!"
        });

        setTimeout(() => {
            exampleApp.data.message = "This message has changed!";
        }, 5000);
    </script>
</body>
```