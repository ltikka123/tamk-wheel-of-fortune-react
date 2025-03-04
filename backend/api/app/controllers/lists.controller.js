const listsModel = require('../models/lists.model');
const usersModel = require('../models/users.model');

// Filter values to be returned for API user
const dataItemFilter = (item) => ({id: item.id, data: item.data});
const listFilter = (item) => ({id: item.id, list_name: item.list_name});


// Reads list items + checking user id
const getListByName = async (username, listName) => {

    // fetch user from users table
    const user = await usersModel.getUser(username);
    if (!user || user.length === 0) {
        return {error: "User not found"};
    }

    const userId = user[0].id;

    // fetch requested list by name and check that list has correct user id
    const list = await listsModel.getListByName(userId, listName);
    if (list === undefined || list.length === 0) {
        return {error: "List not found"};
    }

    const listId = list[0].id;

    // fetch all items from that list and filter wanted fields
    const response = await listsModel.getItemsFromList(listId);
    return (response.map(dataItemFilter));
}


const getAllLists = async (req, res) => {
    try {
        const user = await usersModel.getUser(req.user.username);
        if (!user || user.length === 0) {
            res.status(404).json({error: "User not found"});
            return;
        }

        console.log(`User ${req.user.username} requesting all lists`);

        const userId = user[0].id;
        const lists = await listsModel.getLists(userId);

        if (lists === undefined || lists.length === 0) {
            res.status(404).json({error: "User has no lists"});
            return;
        } else {
            res.json(lists.map(listFilter));
        }
    } catch (error) {
        res.status(500).json({error: "Internal error"});
    }
};

const getList = async (req, res) => {
    try {
    const { listName } = req.params;

    if (listName === undefined) {
        res.status(500).json({error: "Internal error"});
        return;
    }

    console.log(`User: ${req.user.username} requesting list: ${listName}`);

    const result = await getListByName(req.user.username, listName);

    console.log(`List ${listName} data: ${result}`);

    if (result.error) {
        res.status(404).json(result);
    } else {
        res.status(200).json(result);
    }

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
            console.log(`Failed to create a new list "${req.params.ListName}" for user "${req.user.username}"`);
            res.status(500).json({error: "Failed to create a new list"});
        } else {
            console.log(`Created new list "${req.params.ListName}" for user "${req.user.username}"`);
            res.json(response.list_name);
        }
    } catch (error) {
        res.status(500).json({error: "Failed to create a new list. List might already exist."});
    }
}

const addItemToList = async (req, res) => {
    const { listName, itemName } = req.params;

    try {
        // Read user from users table
        const user = await usersModel.getUser(req.user.username);
        if (!user || user.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Find list belonging to that user
        const list = await listsModel.getListByName(user[0].id, listName);
        if (!list || list.length === 0) {
            return res.status(404).json({ error: `List ${listName} not found` });
        }

        const listId = list[0].id;

        // Verify that no duplicates are added to a list
        const listItems = await listsModel.getItemsFromList(listId);
        if (listItems.some(item => item.data === itemName)) {
            return res.status(409).json({ error: `${itemName} already exists in this list`})
        }

        // Add item to that list: is the previous call to DB really necessary?
        const response = await listsModel.addItemToList(listId, itemName);
        if (!response) {
            return res.status(500).json({ error: "Failed to add item" });
        }

        console.log(`Added item "${itemName} for users "${req.user.username}" list "${listName}"`);

        // read and return the new list
        const result = await getListByName(req.user.username, listName);
        if (result.error) {
            res.status(404).json(result);
        } else {
            res.status(200).json(result);
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal error" });
    }
}


const deleteList = async (req, res) => {
    const { listName } = req.params;  // Get the list name from params
    try {
        const user = await usersModel.getUser(req.user.username);
        if (!user || user.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        
        const list = await listsModel.getListByName(user[0].id, listName);
        if (!list || list.length === 0) {
            return res.status(404).json({ error: `List ${listName} not found` });
        }

        const response = await listsModel.deleteList(user[0].id, list[0].id);
        if (!response) {
            return res.status(500).json({ error: "Failed to delete the list" });
        }

        console.log(`Deleted list "${listName}" from user "${req.user.username}"`);
        res.status(200).json({ message: `List '${listName}' deleted successfully` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const removeItemFromList = async (req, res) => {
    const { listName } = req.params;
    const { itemName } = req.params;
  // Read user from users table
    const user = await usersModel.getUser(req.user.username);
    if (!user || user.length === 0) {
        return res.status(404).json({ error: "User not found" });
    }

    const userId = user[0].id;

    try {
        const success = await listsModel.deleteItemFromList(userId, listName, itemName);
        if (success) {
            console.log(`deleted item "${itemName}" from users "${req.user.username} list "${listName}"`);
            res.status(200).json(await getListByName(req.user.username, listName));
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
