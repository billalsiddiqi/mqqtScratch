const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
// const TargetType = require('../../extension-support/target-type');

class Scratch3YourExtension {
    
    constructor(runtime) {
        this.runtime = runtime;
        this.client = null;
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
                    opcode: 'connectToBroker',
                    blockType: BlockType.COMMAND,
                    text: 'Connect to MQTT Broker',
                },
                {
                    opcode: 'subscribeToTopic',
                    blockType: BlockType.COMMAND,
                    text: 'Subscribe to topic [topic]',
                    arguments: {
                        topic: {
                            type: ArgumentType.STRING,
                            defaultValue: 'test/topic',
                        },
                    },
                },
            ],
        };
    }

    connectToBroker() {
        return new Promise((resolve, reject) => {
            const url = 'https://cdnjs.cloudflare.com/ajax/libs/mqtt/5.3.6/mqtt.js';
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
                    }
                    return response.text();
                })
                .then(script => {
                    // Execute the script using eval
                    eval(script);
                    // Initialize the MQTT client
                    this.client = script.connect('mqtt://test.mosquitto.org');
                    // Event handlers for MQTT client
                    this.client.on('connect', () => {
                        console.log('Connected to MQTT broker');
                        resolve();
                    });
                    this.client.on('error', (error) => {
                        console.error('MQTT connection error:', error);
                        reject(error);
                    });
                })
                .catch(error => {
                    console.error('Error loading MQTT library:', error);
                    reject(error);
                });
        });
    }

    subscribeToTopic(args) {
        const topic = args.topic;
        if (!this.client) {
            console.error('MQTT client is not initialized. Please connect to MQTT broker first.');
            return;
        }
        this.client.subscribe(topic, (err) => {
            if (err) {
                console.error('Error subscribing to topic:', err);
            } else {
                console.log(`Subscribed to topic: ${topic}`);
            }
        });
    }
}


module.exports = Scratch3YourExtension;
