module.exports = function (RED) {
  "use strict";
  var mqtt = require("mqtt");

  function XivelyMQTTNode(n) {
    RED.nodes.createNode(this,n);
    this.feed_id = n.feed_id;
    this.id_data = n.id_data;
    this.api_key = n.api_key;
    this.client = mqtt.connect("mqtt://api.xively.com:1883", {username: this.api_key});
    var node = this;

    this.on("input", function(msg) {
      var feed_id = msg.feed_id||node.feed_id;
      var id_data = msg.id_data||node.id_data;
      var value = msg.payload;

      id_data = id_data.split(' ').join('_');
      id_data = id_data.split('\'').join('_');

      node.client.publish(`/v2/feeds/${feed_id}.csv`, `${id_data},${value}`, { qos: 1 })
    });
  }
  RED.nodes.registerType("xively_mqtt", XivelyMQTTNode);
}
