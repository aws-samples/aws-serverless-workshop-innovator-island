# Building visualizations #3

*[Click here](../README.md) to return the *Building visualizations* instructions at any time.*

To create the visualization, follow these steps from QuickSight analysis dashboard.

## Arrival time by visitor age

This visualization charts the arrival time throughout the day against visitor age.

**:white_check_mark: Step-by-step Instructions**

1. Click the **Add** dropdown in the top menu bar, choose **Add visual**.
1. Click **Filter** in the *Analysis menu bar*, then choose **Create one...**.
1. Choose **event** from the list. Click *event* and check **Entry**. Choose **Apply** then **Close**.
1. Click **Visualize** in the *Analysis menu bar*.
1. In *Visualization types*, choose **Line chart**.
1. Click the *Field Wells* panel to open this section.
1. Drag **visitor.arrivalTime** from the *Fields list* to the *X axis* box in the *Field wells*.
1. Click the dropdown arrow next to the *visitor.arrivalTime* field in the well, select the *Aggregate* sub-menu and choose **Minute**.
1. Drag **visitor.age** from the *Fields list* to the *Color* box in the *Field wells*.
1. Click the title of the visualization and rename from *Insight* to *Arrival time by visitor age*.

The finished visualization looks like the graph below.

![Completed visualization](../../images/module5-3-visualization-3.png)

## Next steps

Go back to [Building visualizations](./README.md#building-visualizations).