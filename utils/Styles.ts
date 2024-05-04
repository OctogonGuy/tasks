import { StyleSheet } from "react-native";

// --- Styles ---
export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
    width: "100%",
  },
  text: {
    fontSize: 14,
  },
  list: {
  },
  listSeparator: {
    height: 1
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  listItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  listItemCheckBox: {
    marginRight: 14,
    padding: 9,
    borderColor: "black",
  },
  listItemDragButton: {
    width: 27,
    height: 27,
  },
  bottomTabs: {
    backgroundColor: "white",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  newTaskButton: {
    backgroundColor: "#f88080",
    borderColor: "#ac0e0e",
    borderWidth: 2,
    borderRadius: 5,
    padding: 8,
    marginVertical: 10,
    
  },
  newTaskButtonSvg: {
    width: 24,
    height: 24,
  },
  addTaskButtonContainer: {
    marginVertical: 10,
  },
  form: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
  },
  textInput: {
    backgroundColor: "white",
    width: "100%",
    borderWidth: 1,
    borderColor: "gray",
    paddingHorizontal: 8,
  },
});
