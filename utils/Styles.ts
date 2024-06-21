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
  subtext: {
    color: "gray"
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
    gap: 14
  },
  listItemCheckBox: {
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
    paddingHorizontal: 12,
    paddingVertical: 4
  },
  dropdown: {
    backgroundColor: "#ffffff",
    borderColor: "#575757",
    borderWidth: 1,
    paddingVertical: 0,
    paddingHorizontal: 10,
    minWidth: 175
  },
  newCategoryModal: {
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    width: "75%",
    height: 200,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    alignSelf: "center",
    marginVertical: "auto",
    gap: 40,
    padding: 15
  },
  controlGroup: {
    flex: 0,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 12,
    gap: 12,
    marginVertical: 20
  },
  subdivision: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 12,
    gap: 12,
    marginVertical: 2
  }
});
