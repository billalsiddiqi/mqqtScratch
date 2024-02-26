const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
// const TargetType = require('../../extension-support/target-type');

class Scratch3YourExtension {

    constructor (runtime) {
        this.runtime = runtime;
        this.host = 'test.mosquitto.org';
        this.port = 8081;
        this.topic = '/scratchExtensionTopic';
        this.useTLS = true;
        this.username = null;
        this.password = null;
        this.state = { status: 1, msg: 'loaded' };
        this.mqtt = null;
        this.reconnectTimeout = 2000;
        this.messagePayload = '';
        this.newMessage = false;
    }

    /**
     * Returns the metadata about your extension.
     */
    getInfo () {
        return {
            // unique ID for your extension
            id: 'mqtt',

            // name that will be displayed in the Scratch UI
            name: 'MQTT Extension',

            // colours to use for your extension blocks
            color1: '#000099',
            color2: '#660066',

            // icons to display
            blockIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==',
            menuIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==',

            // your Scratch blocks
            blocks: [
                {
                    opcode: 'sendMessage',
                    blockType: BlockType.COMMAND,
                    text: 'send message %s to topic %s',
                    arguments: {
                        MESSAGE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'message'
                        },
                        TOPIC: {
                            type: ArgumentType.STRING,
                            defaultValue: 'topic'
                        }
                    }
                },
                {
                    opcode: 'getMessage',
                    blockType: BlockType.REPORTER,
                    text: 'message'
                },
                {
                    opcode: 'whenMessageArrived',
                    blockType: BlockType.HAT,
                    text: 'when message arrived'
                },
                {
                    opcode: 'isMessageArrived',
                    blockType: BlockType.BOOLEAN,
                    text: 'message arrived'
                },
                {
                    opcode: 'setTLS',
                    blockType: BlockType.COMMAND,
                    text: 'secure connection %m.secureConnection',
                    arguments: {
                        SECURE: {
                            type: ArgumentType.STRING,
                            menu: 'secureConnection',
                            defaultValue: 'true'
                        }
                    }
                },
                {
                    opcode: 'setHost',
                    blockType: BlockType.COMMAND,
                    text: 'Host %s',
                    arguments: {
                        HOST: {
                            type: ArgumentType.STRING,
                            defaultValue: 'test.mosquitto.org'
                        }
                    }
                },
                {
                    opcode: 'setTopic',
                    blockType: BlockType.COMMAND,
                    text: 'Subscribe to topic %s',
                    arguments: {
                        TOPIC: {
                            type: ArgumentType.STRING,
                            defaultValue: '/scratchExtensionTopic'
                        }
                    }
                },
                {
                    opcode: 'setPort',
                    blockType: BlockType.COMMAND,
                    text: 'Port %n',
                    arguments: {
                        PORT: {
                            type: ArgumentType.STRING,
                            defaultValue: '8081'
                        }
                    }
                },
                {
                    opcode: 'connect',
                    blockType: BlockType.COMMAND,
                    text: 'connect'
                }
            ],
        };
    }


    /**
     * implementation of the block with the opcode that matches this name
     *  this will be called when the block is used
     */
    getMessage() {
        return this.messagePayload;
    }

    whenMessageArrived() {
        return this.newMessage;
    }

    isMessageArrived() {
        return this.newMessage;
    }

    setTLS(args) {
        this.useTLS = args.SECURE === 'true';
    }

    setHost(args) {
        this.host = args.HOST;
    }

    setTopic(args) {
        this.topic = args.TOPIC;
    }

    setPort(args) {
        this.port = args.PORT;
    }

    connect() {
        this.MQTTconnect();
    }

    MQTTconnect() {
        if (typeof path === 'undefined') {
            path = '/mqtt';
            console.log('path=' + path);
        }

        this.mqtt = new Paho.MQTT.Client(
            this.host,
            this.port,
            'web_' + parseInt(Math.random() * 100, 10)
        );

        var options = {
            timeout: 3,
            useSSL: this.useTLS,
            cleanSession: true,
            onSuccess: this.onConnect.bind(this),
            onFailure: this.onConnectionLost.bind(this)
        };

        this.mqtt.onConnectionLost = this.onConnectionLost.bind(this);
        this.mqtt.onMessageArrived = this.onMessageArrived.bind(this);

        if (this.username !== null) {
            options.userName = this.username;
            options.password = this.password;
        }

        console.log(
            'Host=' +
                this.host +
                ', port=' +
                this.port +
                ', path=' +
                path +
                ' TLS = ' +
                this.useTLS +
                ' username=' +
                this.username +
                ' password=' +
                this.password
        );
        this.mqtt.connect(options);
    }

    onConnect() {
        console.log('trying to connect');
        this.state = { status: 1, msg: 'connecting ...' };
        console.log('Connected to ' + this.host + ':' + this.port + path);
        this.mqtt.subscribe(this.topic, { qos: 0 });
        this.state = { status: 2, msg: 'connected' };
    }

    onMessageArrived(message) {
        console.log('message arrived ' + message.payloadString);
        this.messagePayload = message.payloadString;
        this.newMessage = true;
    }

    onConnectionLost(response) {
        this.state = { status: 1, msg: 'connecting ...' };
        setTimeout(this.MQTTconnect.bind(this), this.reconnectTimeout);
        console.log(
            'connection lost: ' + response.errorMessage + '. Reconnecting'
        );
    }
}

module.exports = Scratch3YourExtension;
