import { isValidScriptureRef } from './isValid.mjs';

var ScriptureControl = createClass({
  isValid: (value) => {
    if (!isValidScriptureRef(value)) {
      return { error: { message: 'Must be a valid scripture reference' } };
    }

    return true;
  },

  render: function () {
    return h('input', {
      id: this.props.forID,
      className: this.props.classNameWrapper,
      type: 'text',
      value: this.props.value || '',
      onChange: (e) => this.props.onChange(e.target.value),
    });
  },
});

var ScripturePreview = createClass({
  render: function () {
    return h('span', {}, String(this.props.value ?? ''));
  },
});

CMS.registerFieldType('scripture', ScriptureControl, ScripturePreview);
