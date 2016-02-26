# ractive.dragging.js

Native HTML5 Sortable ractive event definition.

## Usage

After including [ractive](https://github.com/Rich-Harris/Ractive) and `ractive.sortable.js`:

**Template**

```html
<ul on-sortable="sortElement">
  {{#items:i}}
    <li>{{items[i]}}</li>
  {{/items}}</ul>
```   

**Code**

Ractive Boilerplate

```js
ractive = new Ractive({
  el: containerElement,
  template: templateElement,
  data: {
    items: [
      'One', 'Two', 'Three'
    ]
  }
});
```
            
Fires callback on sortable element drop event:

```js
ractive.on('sortElement', function (event) {
  // do something in the callback. Element is already sorted anyways ...
  console.log(event);
});
```

## Event Object

- `name` Event name
- `type` Event type
- `target` Element being dragged or dropped.
- `original` Native DOM Event