## WebSocket

```typescript
const bridge = new DataBridge(
    DataBridge.webScoketEngine("wss://my-host.com/channel")
);

// call instance A
bridge.call("my message", "Hello world").then((message) => {
    console.log(message);
    // Hi
});

// subscribe others instances
bridge.registreHandler("my message", (message) => {
    console.log(message);
    // Hello world
    return "Hi";
});
```

## ObjectEvent

```typescript
const bridgeA = new DataBridge(DataBridge.objectEventEngine());

const bridgeB = new DataBridge(DataBridge.objectEventEngine());

bridgeA.call("my message", "Hello world").then((message) => {
    console.log(message);
    // Hi
});

bridgeB.registreHandler("my message", (message) => {
    console.log(message);
    // Hello world
    return "Hi";
});
```

## PostMessage

### postMessage only self tab

```typescript
const bridgeA = new DataBridge(DataBridge.postMessageEngine());

const bridgeB = new DataBridge(DataBridge.postMessageEngine());

bridgeA.call("my message", "Hello world").then((message) => {
    console.log(message);
    // Hi
});

bridgeB.registreHandler("my message", (message) => {
    console.log(message);
    // Hello world
    return "Hi";
});
```

### postMessage -> Parent / Child

parent

```typescript
const bridge = new DataBridge(
    DataBridge.postMessageEngine(
        document.querySelector(".frame").contentWindow,
        window
    )
);
```

iframe

```typescript
const bridge = new DataBridge(DataBridge.postMessageEngine(parent, window));
```

### postMessage cross tab

```typescript
const bridge = new DataBridge(
    DataBridge.postMessageEngine(new BroadcastChannel("my channel"))
);

// call tab A
bridge.call("my message", "Hello world").then((message) => {
    console.log(message);
    // Hi
});

// subscribe others tabs
bridge.registreHandler("my message", (message) => {
    console.log(message);
    // Hello world
    return "Hi";
});
```
