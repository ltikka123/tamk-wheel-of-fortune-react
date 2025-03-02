const listsModel = require('../models/lists.model');
const usersModel = require('../models/users.model');


const getAllLists = async (req, res) => {
    try {
        const user = await usersModel.getUser(req.user.username); //)[0].id;
        if (!user || user.length === 0) {
            res.status(404).json({error: "User not found"});
            return;
        }

        const userId = user[0].id;
        const lists = await listsModel.getLists(userId);

        if (lists === undefined || lists.length === 0) {
            res.status(404).json({error: "User has no lists"});
            return;
        } else {
            res.json(lists);
        }
    } catch (error) {
        res.status(500).json({error: "Internal error"});
    }
};

const getList = async (req, res) => {
    const { listName } = req.params;

    if (listName === undefined) {
        res.status(500).json({error: "Internal error"});
        return;
    }

    try {
        const user = await usersModel.getUser(req.user.username);
        if (!user || user.length === 0) {
            res.status(404).json({error: "User not found"});
            return;
        }
        const userId = user[0].id;

        const list = await listsModel.getListByName(userId, listName);
        if (list === undefined || list.length === 0) {
            res.status(404).json({error: "List not found"});
            return;
        }

        const listId = list[0].id;
        const items = await listsModel.getItemsFromList(listId);
        res.json(items);

    } catch (error) {
        res.status(500).json({error: "Internal error"});
    }

}

const createNewList = async (req, res) => {
    try {
        const user = await usersModel.getUser(req.user.username);
        if (!user || user.length === 0) {
            res.status(404).json({error: "User not found"});
            return;
        }

        const userId = user[0].id;
        const response = await listsModel.createList(userId, req.params.listName);

        if (response === undefined || response.length === 0) {
            res.status(500).json({error: "Failed to create a new list"});
        } else {
            res.json({ lists: response });
        }
    } catch (error) {
        res.status(500).json({error: "Failed to create a new list. Check list name."});
    }
}

const addItemToList = async (req, res) => {
    const { listName, itemName } = req.params;

    try {
        const user = await usersModel.getUser(req.user.username);
        if (!user || user.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const list = await listsModel.getListByName(user[0].id, listName);
        if (!list || list.length === 0) {
            return res.status(404).json({ error: `List ${listName} not found` });
        }

        const response = await listsModel.addItemToList(list[0].id, itemName);
        if (!response) {
            return res.status(500).json({ error: "Failed to add item" });
        }

        return res.status(200).json( itemName);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal error" });
    }
}


const deleteList = async (req, res) => {
    const { listName } = req.params;  // Get the list name from params
    try {
        // Get the user from the token (assuming the token includes the username)
        const user = await usersModel.getUser(req.user.username);
        if (!user || user.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        
        // Get the list for the user
        const list = await listsModel.getListByName(user[0].id, listName);
        if (!list || list.length === 0) {
            return res.status(404).json({ error: `List ${listName} not found` });
        }

        // Delete the list (and its associated items)
        const response = await listsModel.deleteList(list[0].id);
        if (!response) {
            return res.status(500).json({ error: "Failed to delete the list" });
        }

        // Respond with a success message
        res.status(200).json({ message: `List '${listName}' deleted successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const removeItemFromList = async (req, res) => {
    const { listName } = req.params;
    const { itemName } = req.params;

    try {
        const success = await listsModel.deleteItemFromList(listName, itemName);
        if (success) {
            res.status(200).json({ message: "Item deleted" });
        } else {
            res.status(404).json({ message: "Item not found in the list" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal error" });
    }
}

module.exports = {
    getAllLists,
    getList,
    createNewList,
    addItemToList,
    deleteList,
    removeItemFromList
};
