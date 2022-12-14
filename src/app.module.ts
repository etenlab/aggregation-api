import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { IntrospectAndCompose } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        // ... Apollo server options
        cors: true,
      },
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            {
              name: 'notifications',
              url: process.env.SUBGRAPH_NOTIFICATION_URL, // 'http://localhost:8204/graphql',
            },
            { name: 'discussions', url: process.env.SUBGRAPH_DISCUSSION_URL }, // 'http://localhost:8202/graphql'
            { name: 'site_text', url: process.env.SUBGRAPH_SITE_TEXT_URL }, // 'http://localhost:8209/graphql'
            { name: 'voting', url: process.env.SUBGRAPH_VOTING_URL }, // 'http://localhost:8210/graphql'
          ],
        }),
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
