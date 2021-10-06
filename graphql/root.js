const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

const FileType = require("./file.js");

const files = require("../models/graphData.js");

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        file: {
            type: FileType,
            description: 'A single file',
            args: {
                filename: { type: GraphQLString }
            },
            resolve: async function (parent, args) {
                let filesArray = await files.getAll();

                return filesArray.find(file => file.filename === args.filename);
            }
        },

        files: {
            type: GraphQLList(FileType),
            description: 'List of all files',
            resolve: async function () {
                return await files.getAll();
            }
        }
    })
});


const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        newFile: {
            type: FileType,
            description: 'New a file',
            args: {
                filename: { type: GraphQLNonNull(GraphQLString) },
                content: { type: GraphQLNonNull(GraphQLString) },
                owner: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async function (parent, args)  {
                return await files.newFile(undefined, args.filename, args.content, args.owner);
            }
        },

        deleteFile: {
            type: FileType,
            description: 'Delete a file',
            args: {
                filename: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                console.log(args);
                files.deleteOne(undefined, args.filename);
            }
        },

        updateAllowed: {
            type: FileType,
            description: 'Update a file with allowed',
            args: {
                filename: { type: GraphQLNonNull(GraphQLString) },
                allowed: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                return files.updateAllowed(undefined, args.filename, args.allowed);
            }
        },

        updateContent: {
            type: FileType,
            description: 'Update content',
            args: {
                filename: { type: GraphQLNonNull(GraphQLString) },
                content: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                return files.updateContent(undefined, args.filename, args.content);
            }
        }
    })
});


module.exports.RootQueryType = RootQueryType;
module.exports.RootMutationType = RootMutationType;
