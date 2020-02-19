# Building visualizations #1

*[Click here](../README.md) to return the *Building visualizations* instructions at any time.*

To create the visualization, follow these steps from QuickSight analysis dashboard.

## Average length of park visit by age

This visualization uses the *Exit* park events to calculate the average length of visits by visitor age.

**:white_check_mark: Step-by-step Instructions**

1. Click the **Add** dropdown in the top menu bar, choose **Add visual**.
1. Click **Filter** in the *Analysis menu bar*, then choose **Create one...**.
1. Choose **event** from the list. Click *event* and check **Exit**. Choose **Apply** then **Close**.
1. Click **Visualize** in the *Analysis menu bar*.
1. In *Visualization types*, choose **Horizontal bar chart**.
1. Click the *Field Wells* panel to open this section.
1. Drag **visitor.age** from the *Fields list* to the Y-axis box in the *Field wells*.
1. Drag **minutesInPark** from the *Fields list* to the Value box in the *Field wells*.
1. Select the dropdown arrow next to *minutesInPark (Count)*, select *Aggregate: Count* and change to **Average**.
1. Click the title of the visualization and rename from *Insight* to *Average length of park visit by age*.

The finished visualization looks like the graph below.

![Completed visualization](../../images/module5-3-visualization-1.png)

## Next steps

Go back to [Building visualizations](./README.md#building-visualizations).