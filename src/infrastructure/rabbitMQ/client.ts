import { Channel,connect,Connection } from "amqplib";
import RabbitMQConfig from "../config/rabbitMQ"; 
import Producer from "./producer";
import Consumer from "./consumer";

  

class RabbitMQClient {
    private static instance: RabbitMQClient;
    private connection : Connection |undefined;
    private produceChannel : Channel |undefined;
    private consumerChannel : Channel | undefined;
    private consumer : Consumer |undefined;
    private producer : Producer |undefined;
    private isInitialized =false;


    private constructor(){}

    public static getInstance(){
        if(!this.instance){
            this.instance = new RabbitMQClient();
        }
        return this.instance;
    }


    async initialize(){
        if(this.isInitialized){
            return
        }
        try {
            console.log('Connecting to Rabbitmq..');
            this.connection = await connect(RabbitMQConfig.rabbitMQ.url)
            console.log('line under connecting to rabbitmq');

        
            [this.produceChannel,this.consumerChannel] = await Promise.all([this.connection.createChannel(),this.connection.createChannel()])

            await this.produceChannel.assertQueue(RabbitMQConfig.rabbitMQ.queues.tutorQueue,{durable:true})
            await this.consumerChannel.assertQueue(RabbitMQConfig.rabbitMQ.queues.tutorQueue,{durable:true})

            this.producer = new Producer(this.produceChannel)
            this.consumer = new Consumer(this.consumerChannel)
            this.consumer.consumeMessage();

            this.isInitialized=true;
        } catch (error) {
            console.log("Rabbit error",error)
        }
    }


    async produce(data:any , correlationId: string, replyToQueue: string){
        console.log("producing 0000",data,correlationId,replyToQueue);
        if(!this.isInitialized){
            console.log("hahhahainto instance")
            await this.initialize();
        }
        console.log("instance nite createdgvshsbs000")
        return this.producer?.produceMessage(data,correlationId,replyToQueue)      
    }

}


export default RabbitMQClient.getInstance();