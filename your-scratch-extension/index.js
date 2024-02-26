const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
// const TargetType = require('../../extension-support/target-type');

class Scratch3YourExtension {
    
    constructor (runtime) {
        this.runtime = runtime;
        this.host = 'test.mosquitto.org';
        this.messages = {};
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
                    opcode: 'publish',
                    blockType: BlockType.COMMAND,
                    text: 'publish [message] to [topic]',
                    arguments: {
                        message: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello mqtt'
                        },
                        topic: {
                            type: ArgumentType.STRING,
                            defaultValue: 'scratch-extension'
                        }
                    }
                },
                {
                    opcode: 'onMessage',
                    blockType: BlockType.HAT,
                    text: 'when new message on [topic]',
                    arguments: {
                        topic: {
                            type: ArgumentType.STRING,
                            defaultValue: 'scratch-extension'
                        }
                    }
                },
                {
                    opcode: 'getMessage',
                    blockType: BlockType.REPORTER,
                    text: 'latest message on [topic]',
                    arguments: {
                        topic: {
                            type: ArgumentType.STRING,
                            defaultValue: 'scratch-extension'
                        }
                    }
                }
            ]
        };
    }

    publish(args) {
        console.log(args)
    }

    onMessage(args) {
        // Check if a new message has been received on the specified topic
        const topic = args.topic;
        return this.messages.hasOwnProperty(topic);
    }

    getMessage(args) {
        // Return the latest message received on the specified topic
        const topic = args.topic;
        return this.messages[topic] || '';
    }
}

module.exports = Scratch3YourExtension;
