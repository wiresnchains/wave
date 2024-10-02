function time(label, fn) {
    const start = Date.now();

    fn();

    console.log(label, "took", Date.now() - start, "ms");
}

const stores = [];
const apps = [];
const TARGET_STORES = 100;
const TARGET_APPS = 100;

time(`Benchmark`, () => {
    time(`Initialize ${TARGET_APPS} app elements`, () => {
        for (let i = 0; i < TARGET_APPS; i++) {
            const div = document.createElement("div");
            div.id = "app-" + i;
            div.innerHTML = "{{ count }}";
            document.body.appendChild(div);
        }
    });
    
    time(`Create ${TARGET_STORES} stores`, () => {
        for (let i = 0; i < TARGET_STORES; i++) {
            const store = new WaveStore();

            if (i == 0)
                store.data.count = 128;

            stores.push(store);
        }
    });
    
    time(`Create ${TARGET_APPS} apps`, () => {
        for (let i = 0; i < TARGET_APPS; i++) {
            const app = new WaveApp("#app-" + i);
    
            app.useStores(...stores);
    
            apps.push(app);
        }
    });
    
    time(`Mount ${TARGET_APPS} apps`, () => {
        for (let i = 0; i < apps.length; i++)
            apps[i].mount();
    });
    
    time(`Unmount ${TARGET_APPS} apps`, () => {
        for (let i = 0; i < apps.length; i++)
            apps[i].unmount();
    });
});
