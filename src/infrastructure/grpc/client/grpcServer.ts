import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { tutorController } from '../../../interface/controllers/tutorController';
import config from '../../config/config';

const TUTOR_PROTO_PATH = path.resolve(__dirname, '../proto/tutor.proto');

const tutorPackageDefinition = protoLoader.loadSync(TUTOR_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});


const tutorProtoDescription = grpc.loadPackageDefinition(tutorPackageDefinition) as any;

const tutorProto = tutorProtoDescription.tutor;

const server = new grpc.Server();

server.addService(tutorProto.TutorService.service, {
    login: tutorController.loginTutor.bind(tutorController),
    register: tutorController.registerTutor.bind(tutorController),
    verifyOtp: tutorController.verifyOtp.bind(tutorController),
    googleLogin: tutorController.googleLoginTutor.bind(tutorController),
});

const startGrpcServer = () => {
    const grpcPort = config.grpcPort || 4001; // Assign port 4001 or from config
    server.bindAsync(`0.0.0.0:${grpcPort}`, grpc.ServerCredentials.createInsecure(), (err, bindPort) => {
        if (err) {
            console.error("Failed to start gRPC server:", err);
        } else {
            console.log(`gRPC server running on port: ${grpcPort}`);
        }
    });
};

startGrpcServer();

export { startGrpcServer };
