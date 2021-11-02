const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

const FileType = new GraphQLObjectType({
    name: 'File',
    description: 'This represents a file',
    fields: () => ({
        filename: { type: GraphQLNonNull(GraphQLString) },
        owner: { type: GraphQLNonNull(GraphQLString) },
        content: { type: GraphQLNonNull(GraphQLString) },
        allowed: {
            type: GraphQLList(GraphQLString)
        },
        mode:  {
            type: GraphQLList(GraphQLString)
        }
    })
});

module.exports = FileType;
