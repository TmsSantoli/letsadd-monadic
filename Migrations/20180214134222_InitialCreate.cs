using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace letsaddmonadic.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Tascoll",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Title = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tascoll", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MyTask",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    TascollId = table.Column<int>(type: "int4", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MyTask", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MyTask_Tascoll_TascollId",
                        column: x => x.TascollId,
                        principalTable: "Tascoll",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Urgent",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    TascollId = table.Column<int>(type: "int4", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Urgent", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Urgent_Tascoll_TascollId",
                        column: x => x.TascollId,
                        principalTable: "Tascoll",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MyTask_TascollId",
                table: "MyTask",
                column: "TascollId");

            migrationBuilder.CreateIndex(
                name: "IX_Urgent_TascollId",
                table: "Urgent",
                column: "TascollId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MyTask");

            migrationBuilder.DropTable(
                name: "Urgent");

            migrationBuilder.DropTable(
                name: "Tascoll");
        }
    }
}
