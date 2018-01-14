module.exports = function(schema) {
	const Post = schema.define('Post', {
		title:     { type: schema.String,  limit: 255 },
		content:   { type: schema.Text },
		params:    { type: schema.JSON },
		date:      { type: schema.Date,    default: Date.now },
		published: { type: schema.Boolean, default: false, index: true }
	});
};