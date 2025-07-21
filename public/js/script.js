

// Donut Chart for Budget
if(document.getElementById("budgetChart"))
{
  const ctx = document.getElementById("budgetChart").getContext("2d");
  new Chart(ctx, {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: [92, 8],
          backgroundColor: ["#a659f3", "#eaeaea"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      cutout: "92%",
      plugins: { legend: { display: false } },
    },
  });
}

if(document.getElementById("monthlyLineChart"))
{const monthlyLine = document
  .getElementById("monthlyLineChart")
  .getContext("2d");
new Chart(monthlyLine, {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Consumed",
        data: [200000, 150000, 300000, 250000, 100000, 0],
        borderColor: "#a659f3",
        backgroundColor: "#e4c3ff",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#a659f3",
      },
    ],
  },
  options: {
    plugins: { legend: { display: false } },
  },
});
}
// Line Chart for Monthly Consumed Amount

if(document.getElementById("studentsBarChart"))
{
  const studentsBar = document
  .getElementById("studentsBarChart")
  .getContext("2d");
new Chart(studentsBar, {
  type: "bar",
  data: {
    labels: ["A", "B", "C", "D", "E"],
    datasets: [
      {
        data: [5, 7, 4, 6, 5],
        backgroundColor: "#a659f3",
        borderRadius: 8,
      },
    ],
  },
  options: {
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  },
});
}
// Bar Chart for Students Attendance



