// Make React and Reconciler available globally for QuickJS
const React = require('react');
const Reconciler = require('react-reconciler');

// --- hostConfig for React Reconciler ---
const baseHostConfig = {
  // React 18 required hostConfig stubs
  scheduleTimeout: function(fn, delay) { console.log('hostConfig.scheduleTimeout'); return setTimeout(fn, delay); },
  cancelTimeout: function(id) { console.log('hostConfig.cancelTimeout'); return clearTimeout(id); },
  noTimeout: -1,
  isPrimaryRenderer: true,
  getInstanceFromNode: function() { console.log('hostConfig.getInstanceFromNode'); return null; },
  preparePortalMount: function() { console.log('hostConfig.preparePortalMount'); },
  getCurrentEventPriority: function() { console.log('hostConfig.getCurrentEventPriority'); return 0; },
  detachDeletedInstance: function() { console.log('hostConfig.detachDeletedInstance'); },
  supportsMicrotasks: true,
  supportsTestSelectors: false,
  findFiberRoot: function() { console.log('hostConfig.findFiberRoot'); return null; },
  getBoundingRect: function() { console.log('hostConfig.getBoundingRect'); return { x: 0, y: 0, width: 0, height: 0 }; },
  now() { console.log('hostConfig.now'); return Date.now(); },
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  supportsMicrotaskScheduling: false,
  getRootHostContext(rootContainerInstance) { console.log('hostConfig.getRootHostContext', rootContainerInstance); return {}; },
  getChildHostContext(parentHostContext, type, rootContainerInstance) { console.log('hostConfig.getChildHostContext', parentHostContext, type, rootContainerInstance); return {}; },
  prepareForCommit(containerInfo) { console.log('hostConfig.prepareForCommit', containerInfo); return null; },
  resetAfterCommit(containerInfo) { console.log('hostConfig.resetAfterCommit', containerInfo); },
  createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) { console.log('hostConfig.createInstance', type, props); return { type, props, children: [] }; },
  appendInitialChild(parent, child) { console.log('hostConfig.appendInitialChild', parent, child); parent.children.push(child); },
  finalizeInitialChildren(instance, type, props, rootContainerInstance, hostContext) { console.log('hostConfig.finalizeInitialChildren', instance, type, props, rootContainerInstance, hostContext); return false; },
  prepareUpdate(instance, type, oldProps, newProps, rootContainerInstance, hostContext) { console.log('hostConfig.prepareUpdate', instance, type, oldProps, newProps, rootContainerInstance, hostContext); return true; },
  shouldSetTextContent(type, props) { console.log('hostConfig.shouldSetTextContent', type, props); return false; },
  createTextInstance(text, rootContainerInstance, hostContext, internalInstanceHandle) { console.log('hostConfig.createTextInstance', text); return { type: 'TEXT', text }; },
  scheduleMicrotask(fn) { console.log('hostConfig.scheduleMicrotask'); fn(); },
  appendChild(parent, child) { console.log('hostConfig.appendChild', parent, child); parent.children.push(child); },
  appendChildToContainer(container, child) { console.log('hostConfig.appendChildToContainer', container, child); container.children.push(child); },
  insertBefore(parent, child, beforeChild) { console.log('hostConfig.insertBefore', parent, child, beforeChild); const idx = parent.children.indexOf(beforeChild); if (idx === -1) parent.children.push(child); else parent.children.splice(idx, 0, child); },
  insertInContainerBefore(container, child, beforeChild) { console.log('hostConfig.insertInContainerBefore', container, child, beforeChild); const idx = container.children.indexOf(beforeChild); if (idx === -1) container.children.push(child); else container.children.splice(idx, 0, child); },
  removeChild(parent, child) { console.log('hostConfig.removeChild', parent, child); parent.children = parent.children.filter(c => c !== child); },
  removeChildFromContainer(container, child) { console.log('hostConfig.removeChildFromContainer', container, child); container.children = container.children.filter(c => c !== child); },
  commitUpdate(instance, updatePayload, type, oldProps, newProps, internalInstanceHandle) { console.log('hostConfig.commitUpdate', instance, updatePayload, type, oldProps, newProps); instance.props = newProps; },
  commitTextUpdate(textInstance, oldText, newText) { console.log('hostConfig.commitTextUpdate', textInstance, oldText, newText); textInstance.text = newText; },
  resetTextContent(instance) { console.log('hostConfig.resetTextContent', instance); },
  getPublicInstance(instance) { console.log('hostConfig.getPublicInstance', instance); return instance; },
  clearContainer(container) { console.log('hostConfig.clearContainer', container); container.children = []; }
};

const hostConfig = new Proxy(baseHostConfig, {
  get(target, prop) {
    if (!(prop in target)) {
      console.log('hostConfig MISSING METHOD:', prop);
      return function() { throw new Error('hostConfig missing method: ' + prop); };
    }
    return target[prop];
  }
});


let StringRenderer;
try {
  StringRenderer = Reconciler(hostConfig);
  console.log('Reconciler created:', typeof StringRenderer);
} catch (e) {
  console.log('Error creating Reconciler:', e);
}


function render(element, container) {
  try {
    if (!container._rootContainer) {
      container._rootContainer = StringRenderer.createContainer(
        container,
        0,
        null,
        false,
        null,
        () => {},
        null
      );
      console.log('Created root container');
    }
    StringRenderer.updateContainer(
      element,
      container._rootContainer,
      null,
      () => {}
    );
    console.log('Updated container');
  } catch (e) {
    console.log('Error in render:', e);
  }
}

function renderToString(node) {
  if (node.type === "TEXT") return node.text;
  const children = node.children.map(renderToString).join("");
  return `<${node.type}>${children}</${node.type}>`;
}


const container = { children: [] };
try {
  render(
    <div>
      <h1>Hello from QuickJS + React 18!</h1>
      <p>Custom reconciler works 🎉</p>
    </div>,
    container
  );
  // Avoid circular reference in logs
  console.log('Rendered tree children:', JSON.stringify(container.children, null, 2));
  console.log(renderToString(container.children[0]));
} catch (e) {
  console.log('Error during render phase:', e);
}
